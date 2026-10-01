export interface LlmCompletionRequest {
  systemPrompt: string;
  userPrompt: string;
  maxTokens: number;
  temperature?: number;
}

export interface LlmUsageMetrics {
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  durationMs?: number;
  model?: string;
}

export interface LlmCompletionResponse {
  rawJson: string;
  parsedJson: Record<string, unknown>;
  usage?: LlmUsageMetrics;
}

export interface LlmProvider {
  completeJson(request: LlmCompletionRequest): Promise<LlmCompletionResponse>;
}
