import { Groq } from "groq-sdk";

function getGroqClient(): Groq {
  const apiKey = process.env.GROQ_API_KEY || process.env.api;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY environment variable is not configured");
  }
  return new Groq({ apiKey });
}

export function buildNoteSystemPrompt(userIntent?: string): string {
  const intentContext = userIntent
    ? `The user's purpose for taking notes in Notter is '${userIntent}'. Tailor the depth, tone, and practical focus to best serve this purpose (e.g., actionable and structured for 'work', thorough and conceptual for 'study', reflective and practical for 'personal').`
    : "";

  return `You are Notter, an elite AI note-taking and reasoning companion.
Your mission is to analyze the user's prompt, raw thoughts, or question, and generate a clear, beautifully structured, insightful personal note.

${intentContext}

Format the note strictly in Markdown using the following structure:
1. TITLE (Line 1):
   - Line 1 MUST start with a single '# ' followed by a concise, compelling note title (e.g., '# Q4 Product Launch Strategy').
   - Do NOT write 'Title:', 'Note:', or enclose it in code fences.

2. OVERVIEW / EXECUTIVE SUMMARY:
   - Immediately follow the title with a blank line, then a 2-3 sentence overview capturing the core objective, context, or essence of the topic.

3. STRUCTURED SECTIONS (Headings & Subheadings):
   - Use '## ' for main sections and '### ' for subsections.
   - Deconstruct the topic logically into pillars, key components, or strategic steps.
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
}

export async function generateNoteStream({
  prompt,
  intent,
}: GenerateNoteStreamOptions): Promise<ReadableStream<Uint8Array>> {
  const groq = getGroqClient();
  const systemPrompt = buildNoteSystemPrompt(intent);

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
