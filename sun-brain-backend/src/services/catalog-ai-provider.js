import OpenAI from "openai";

export const CATALOG_MODEL = "gpt-6.1-terra";

export class CatalogAIProvider {
  constructor() {
    this.baseURL = (
      process.env.SIMPLE_CLAW_BASE_URL || "https://simple-claw.ru/v1"
    ).replace(/\/$/, "");
    this.apiKey = process.env.SIMPLE_CLAW_API_KEY;
    this.client = new OpenAI({
      baseURL: this.baseURL,
      apiKey: this.apiKey || "missing-api-key",
      maxRetries: 0,
      timeout: 180_000,
    });
  }

  async pricing() {
    if (!this.apiKey)
      throw Object.assign(new Error("SIMPLE_CLAW_API_KEY is not configured"), {
        status: 503,
      });
    const response = await fetch(`${this.baseURL}/models`, {
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok)
      throw new Error("SimpleClaw model catalog is unavailable");
    const model = (await response.json()).data?.find(
      (item) => item.id === CATALOG_MODEL,
    );
    const pricing = model?.pricing;
    if (
      !model?.protocols?.includes("responses") ||
      !pricing ||
      ![pricing.inputRublesPerMillion, pricing.outputRublesPerMillion].every(
        (v) => Number.isFinite(v) && v > 0,
      )
    ) {
      throw new Error("Model protocol or pricing cannot be verified");
    }
    return pricing;
  }

  // UTF-8 byte count deliberately overestimates text tokens. No images/tools/history are sent.
  reserve(messages, maxTokens, pricing) {
    const inputBound =
      Buffer.byteLength(JSON.stringify(messages), "utf8") + 4096;
    const inputRate = Math.max(
      pricing.inputRublesPerMillion,
      pricing.cacheCreation1hRublesPerMillion || 0,
      pricing.cacheCreation5mRublesPerMillion || 0,
    );
    const outputRate = Math.max(
      pricing.outputRublesPerMillion,
      pricing.reasoningRublesPerMillion || 0,
    );
    return (
      Math.ceil((inputBound * inputRate + maxTokens * outputRate) * 1.1) /
      1_000_000
    );
  }

  async complete(messages, maxTokens) {
    const response = await this.client.responses.create({
      model: CATALOG_MODEL,
      input: messages,
      max_output_tokens: maxTokens,
      stream: false,
      store: false,
    });
    const text =
      response.output_text ||
      response.output
        ?.flatMap((item) => item.content || [])
        .filter((item) => item.type === "output_text")
        .map((item) => item.text)
        .join("") ||
      "";
    return {
      text,
      usage: response.usage,
      id: response.id,
      model: response.model,
      reasoning: response.reasoning,
      status: response.status,
    };
  }
}
