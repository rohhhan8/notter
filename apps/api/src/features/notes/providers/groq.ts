import { Groq } from "groq-sdk";
import type { LlmCompletionRequest, LlmCompletionResponse, LlmProvider } from "./types";

function getGroqClient(): Groq {
  const apiKey = process.env.GROQ_API_KEY || process.env.api;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY environment variable is not configured");
  }
  return new Groq({ apiKey });
}

export class GroqProvider implements LlmProvider {
  private client: Groq | null = null;
  private primaryModel: string;
  private fallbackModel: string;

  constructor() {
    this.primaryModel = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
    this.fallbackModel = "llama-3.3-70b-versatile";
  }

  private getClient(): Groq {
    if (!this.client) {
      this.client = getGroqClient();
    }
    return this.client;
  }

  async completeJson(request: LlmCompletionRequest): Promise<LlmCompletionResponse> {
    const startTime = Date.now();

    try {
      return await this.executeCall(this.primaryModel, request, startTime);
    } catch (primaryError) {
      console.warn(
        `Primary Groq model ${this.primaryModel} failed (${(primaryError as Error)?.message}). Trying fallback ${this.fallbackModel}...`
      );
      try {
        return await this.executeCall(this.fallbackModel, request, startTime);
      } catch (fallbackError) {
        console.error("Fallback Groq model also failed:", fallbackError);
        throw fallbackError;
      }
    }
  }

  private async executeCall(
    model: string,
    request: LlmCompletionRequest,
    startTime: number
  ): Promise<LlmCompletionResponse> {
    const chatCompletion = await this.getClient().chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: request.systemPrompt,
        },
        {
          role: "user",
          content: request.userPrompt,
        },
      ],
      response_format: {
        type: "json_object",
      },
      max_tokens: request.maxTokens,
      temperature: request.temperature ?? 0.3,
    });

    const durationMs = Date.now() - startTime;
    const content = chatCompletion.choices[0]?.message?.content || "{}";

    let parsedJson: Record<string, unknown>;
    try {
      parsedJson = JSON.parse(content);
    } catch {
      // Strip potential code fences if returned
      const sanitized = content
        .replace(/^```json\s*/i, "")
        .replace(/\s*```$/, "")
        .trim();
      parsedJson = JSON.parse(sanitized);
    }

    return {
      rawJson: content,
      parsedJson,
      usage: {
        promptTokens: chatCompletion.usage?.prompt_tokens,
        completionTokens: chatCompletion.usage?.completion_tokens,
        totalTokens: chatCompletion.usage?.total_tokens,
        durationMs,
        model,
      },
    };
  }
}

export const groqProvider = new GroqProvider();
