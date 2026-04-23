import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";

const openaiKey =
  process.env.OPENAI_API_KEY ?? process.env.AI_INTEGRATIONS_OPENAI_API_KEY;
const openaiBaseUrl =
  process.env.OPENAI_BASE_URL ?? process.env.AI_INTEGRATIONS_OPENAI_BASE_URL;

export const openai = openaiKey
  ? new OpenAI({
      apiKey: openaiKey,
      ...(openaiBaseUrl ? { baseURL: openaiBaseUrl } : {}),
    })
  : null;

const geminiKey =
  process.env.GEMINI_API_KEY ?? process.env.AI_INTEGRATIONS_GEMINI_API_KEY;
const geminiBaseUrl =
  process.env.GEMINI_BASE_URL ?? process.env.AI_INTEGRATIONS_GEMINI_BASE_URL;

export const gemini = geminiKey
  ? new GoogleGenAI({
      apiKey: geminiKey,
      ...(geminiBaseUrl ? { httpOptions: { baseUrl: geminiBaseUrl } } : {}),
    })
  : null;

const grokKey = process.env.GROK_API_KEY;
export const grok = grokKey
  ? new OpenAI({
      apiKey: grokKey,
      baseURL: process.env.GROK_BASE_URL ?? "https://api.x.ai/v1",
    })
  : null;
