import { OpenAI } from 'openai';
import { env } from '../config/env.js';
import { getPersona } from '../personas/index.js';

let client;

function getClient() {
  if (!env.openaiApiKey) {
    throw new Error('OPENAI_API_KEY is not configured. Add it to your .env file.');
  }
  if (!client) {
    client = new OpenAI({ apiKey: env.openaiApiKey });
  }
  return client;
}

function parsePipelineStep(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return { step: 'OUTPUT', text: raw };
  }
}

export async function chatWithPersona(personaId, messages) {
  const persona = getPersona(personaId);
  if (!persona) {
    throw new Error(`Unknown persona: ${personaId}`);
  }

  const conversation = [{ role: 'system', content: persona.systemPrompt }, ...messages];

  if (!persona.pipeline) {
    const result = await getClient().chat.completions.create({
      model: persona.model,
      messages: conversation,
    });

    const content = result.choices[0].message.content;
    return {
      personaId: persona.id,
      messages: [{ role: 'assistant', content, step: null }],
      updatedHistory: [...messages, { role: 'assistant', content }],
    };
  }

  const steps = [];
  const workingMessages = [...conversation];

  while (true) {
    const result = await getClient().chat.completions.create({
      model: persona.model,
      messages: workingMessages,
    });

    const rawResult = result.choices[0].message.content;
    const parsed = parsePipelineStep(rawResult);

    workingMessages.push({ role: 'assistant', content: rawResult });
    steps.push({
      role: 'assistant',
      content: parsed.text,
      step: parsed.step,
      raw: rawResult,
    });

    if (parsed.step?.toLowerCase() === 'output') break;
  }

  const assistantSummary = steps.map((s) => `[${s.step}] ${s.content}`).join('\n');

  return {
    personaId: persona.id,
    messages: steps,
    updatedHistory: [...messages, { role: 'assistant', content: assistantSummary }],
  };
}
