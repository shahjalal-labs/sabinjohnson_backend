import OpenAI from "openai";
import config from "../config";
import { OpenAIMessage, OpenAICompletionOptions } from "../types";
import ApiError from "../errors/ApiErrors";
import fs from "fs";
import { products } from "../app/modules/chat/productData";

export class OpenAIService {
  private client: OpenAI | null = null;

  constructor() {
    this.client = new OpenAI({
      apiKey: config.openai.api_key || undefined,
    });
    console.log("OpenAI client initialized successfully");
  }

  /**
   * Check if OpenAI is configured
   */
  private ensureClient(): OpenAI {
    if (!this.client) {
      throw new ApiError(
        503,
        "OpenAI API key is not configured. Please set OPENAI_API_KEY environment variable."
      );
    }
    return this.client;
  }

  /**
   * Create a chat completion
   */
  async createChatCompletion(
    messages: OpenAIMessage[],
    options: OpenAICompletionOptions = {}
  ): Promise<string> {
    const client = this.ensureClient();

    const model = options.model || config.openai.model;
    // const temperature = options.temperature ?? 0.7; //paid models only
    const temperature = options.temperature ?? 1; //for free models
    const maxTokens = options.maxTokens ?? 2048;

    try {
      console.log(`Sending request to OpenAI with model: ${model}`);

      const response = await client.chat.completions.create({
        model,
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        temperature,
        // max_tokens: maxTokens, //paid models only
        max_completion_tokens: maxTokens, //for free models
      });

      const content = response.choices[0]?.message?.content;

      if (!content) throw new ApiError(500, "No response from OpenAI");
      console.log("Received response from OpenAI");

      return content;
    } catch (error) {
      console.error("OpenAI API error:", error);

      if (error instanceof OpenAI.APIError) {
        if (error.status === 401) {
          throw new ApiError(401, "Invalid OpenAI API key");
        }
        if (error.status === 429) {
          throw new ApiError(
            429,
            "OpenAI rate limit exceeded. Please try again later."
          );
        }
        if (error.status === 500 || error.status === 503) {
          throw new ApiError(503, "OpenAI service is temporarily unavailable");
        }
        throw new ApiError(500, `OpenAI API error: ${error.message}`);
      }

      if (error instanceof ApiError) throw error;

      throw new ApiError(500, "Failed to communicate with OpenAI");
    }
  }

  /**
   * Stream a chat completion
   */
  async *streamChatCompletion(
    messages: OpenAIMessage[],
    options: OpenAICompletionOptions = {}
  ): AsyncGenerator<string, void, unknown> {
    const client = this.ensureClient();

    const model = options.model || config.openai.model;
    // const temperature = options.temperature ?? 0.7; //paid models only
    const temperature = options.temperature ?? 1; //for free models
    const maxTokens = options.maxTokens ?? 2048;

    try {
      console.log(`Starting streaming request to OpenAI with model: ${model}`);

      const stream = await client.chat.completions.create({
        model,
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        temperature,
        // max_tokens: maxTokens, //paid models only
        max_completion_tokens: maxTokens, //for free models
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          yield content;
        }
      }

      console.log("Completed streaming response from OpenAI");
    } catch (error) {
      console.log("OpenAI streaming error:", error);

      if (error instanceof OpenAI.APIError) {
        if (error.status === 401) {
          throw new ApiError(401, "Invalid OpenAI API key");
        }
        if (error.status === 429) {
          throw new ApiError(
            429,
            "OpenAI rate limit exceeded. Please try again later."
          );
        }
        throw new ApiError(500, `OpenAI API error: ${error.message}`);
      }

      if (error instanceof ApiError) throw error;

      throw new ApiError(500, "Failed to stream from OpenAI");
    }
  }
}

export const openaiClient = new OpenAI({
  apiKey: config.openai.api_key || undefined,
});

const createDataset = async () => {
  const stream = fs.createWriteStream("products_training_data.jsonl");

  products.forEach((product) => {
    const questions = [
      `What is the price of ${product.name}?`,
      `Describe ${product.name}.`,
      `Give me a summary of ${product.name}.`,
    ];

    questions.forEach((question) => {
      const answer = question.includes("price")
        ? `$${product.price}`
        : product.description;
      stream.write(
        JSON.stringify({
          messages: [
            { role: "user", content: question },
            { role: "assistant", content: answer },
          ],
        }) + "\n"
      );
    });
  });

  stream.end(() =>
    console.log("products_training_data.jsonl created successfully!")
  );
};
// createDataset();

const fineTune = async () => {
  // 1. Upload the training file
  const file = fs.createReadStream("products_training_data.jsonl");

  const uploadedFile = await openaiClient.files.create({
    file,
    purpose: "fine-tune",
  });

  console.log("File uploaded. File ID:", uploadedFile.id);

  // 2. Start fine-tuning
  const fineTune = await openaiClient.fineTuning.jobs.create({
    training_file: uploadedFile.id,
    model: "gpt-3.5-turbo",
  });

  console.log("Fine-tune started:", fineTune);
};
// fineTune().catch(console.error);

const waitForFineTune = async (ftJobId: string) => {
  let job;
  do {
    job = await openaiClient.fineTuning.jobs.retrieve(ftJobId);
    console.log("Status:", job.status);
    if (job.status === "succeeded") return job.fine_tuned_model;
    if (job.status === "failed") throw new Error("Fine-tune failed");
    await new Promise((r) => setTimeout(r, 5000)); // wait 5s
  } while (true);
};
// waitForFineTune("ftjob-3PaLf4GXHmqs0mz5zFoPJJ1A")
//   .then((model) => console.log("Fine-tuned model ready:", model))
//   .catch(console.error);

export default new OpenAIService();
