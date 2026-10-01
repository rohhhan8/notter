import { Groq } from "groq-sdk";

function getGroqClient(): Groq {
  const apiKey = process.env.GROQ_API_KEY || process.env.api;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY environment variable is not configured");
  }
  return new Groq({ apiKey });
}

const MODE_INSTRUCTIONS: Record<string, string> = {
  general:
    "Mode: /general (Anything). Format as a versatile, well-rounded, comprehensive note suitable for any topic.",
  school:
    "Mode: /school (School-level learning). Focus on foundational clarity, intuitive explanations, memorable real-world analogies, core concepts, and beginner-friendly practice questions/exercises.",
  lecture:
    "Mode: /lecture (Classroom/lecture notes). Structure clearly with Lecture Topic, Professor's core thesis/arguments, blackboard breakdown, key definitions, lecture highlights, and exam-relevant review questions.",
  university:
    "Mode: /university (University-level academic notes). Maintain rigorous analytical depth, theoretical foundations, key theorems/proofs/models, scholarly debates, and academic reading references.",
  research:
    "Mode: /research (Research/thesis material). Structure with Research Objectives, Literature Context, Methodological Framework, Detailed Analytical Findings, Theoretical Implications, and Open Research Directions.",
  technical:
    "Mode: /technical (Programming/technical knowledge). Emphasize architecture, concrete production-ready code snippets with language syntax, performance & algorithmic complexity, design patterns, and edge case caveats.",
  meeting:
    "Mode: /meeting (Work/meeting notes). Highlight Meeting Context/Goals, Agenda Breakdown, Summary of Discussions, Decisions Reached, and a distinct Action Items checklist with assignees and follow-ups.",
  book:
    "Mode: /book (Books/chapters). Structure with Book Title & Author Thesis, Central Themes & Chapter Breakdown, Memorable Quotes, Practical Frameworks/Lessons, and Critical Synthesis.",
  idea:
    "Mode: /idea (Ideas/brain dumps). Unpack, organize, and expand upon raw thoughts, identify the Unique Value Proposition, analyze feasibility & potential risks, and outline immediate rapid-validation experiments.",
};

export function buildNoteSystemPrompt(userIntent?: string, mode?: string): string {
  const modeKey = mode ? mode.replace(/^\//, "").toLowerCase() : undefined;
  const modeGuidance = modeKey && MODE_INSTRUCTIONS[modeKey] ? MODE_INSTRUCTIONS[modeKey] : "";

  const intentContext = userIntent
    ? `The user's purpose for taking notes in Notter is '${userIntent}'. Tailor the depth, tone, and practical focus to best serve this purpose (e.g., actionable and structured for 'work', thorough and conceptual for 'study', reflective and practical for 'personal').`
    : "";

  return `You are Notter, an elite AI note-taking and reasoning companion.
Your mission is to analyze the user's prompt, raw thoughts, or question, and generate a clear, beautifully structured, insightful personal note.

${modeGuidance ? `ACTIVE FORMAT INSTRUCTION:\n${modeGuidance}\n` : ""}
${intentContext}

Format the note strictly in Markdown using the following structure:
1. TITLE (Line 1):
   - Line 1 MUST start with a single '# ' followed by a concise, compelling note title (e.g., '# Q4 Product Launch Strategy').
   - Do NOT write 'Title:', 'Note:', or enclose it in code fences.

2. OVERVIEW / EXECUTIVE SUMMARY:
   - Immediately follow the title with a blank line, then a 2-3 sentence overview capturing the core objective, context, or essence of the topic.

3. STRUCTURED SECTIONS (Headings & Subheadings):
   - Use '## ' for main sections and '### ' for subsections.
   - Deconstruct the topic logically into pillars, key components, or strategic steps according to the active format.
   - Use clear bullet points ('- ') for details, facts, and insights.
   - Use strategic bolding (**key concepts**) to make the note scannable.
   - Use blockquotes ('> ') for memorable takeaways, core principles, or key caveats.
   - If technical, include formatted code snippets or tables where relevant.

4. ACTIONABLE CHECKLIST / NEXT STEPS:
   - Conclude with a '## Action Items' or '## Checklist' section with markdown checkboxes ('- [ ] task to complete').

Tone & Aesthetic:
- Crisp, insightful, and well-organized.
- Return ONLY the formatted Markdown note. Do NOT include conversational filler like "Here is your note" or "Hope this helps!".`;
}

export interface GenerateNoteStreamOptions {
  prompt: string;
  intent?: string;
  mode?: string;
}

export async function generateNoteStream({
  prompt,
  intent,
  mode,
}: GenerateNoteStreamOptions): Promise<ReadableStream<Uint8Array>> {
  const groq = getGroqClient();
  const systemPrompt = buildNoteSystemPrompt(intent, mode);

  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "openai/gpt-oss-120b",
    temperature: 1,
    max_completion_tokens: 2048,
    top_p: 1,
    stream: true,
    reasoning_effort: "medium",
    stop: null,
  });

  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of chatCompletion) {
          const content = chunk.choices[0]?.delta?.content || "";
          if (content) {
            controller.enqueue(encoder.encode(content));
          }
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });
}
