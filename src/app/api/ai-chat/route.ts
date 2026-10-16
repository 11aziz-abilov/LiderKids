import { NextRequest, NextResponse } from 'next/server';
import { SHERCHA_SYSTEM_PROMPT, generateOfflineKidResponse, AiAssistantContextData } from '@/utils/aiKidTutor';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface RequestPayload {
  messages: ChatMessage[];
  context?: AiAssistantContextData;
  studentName?: string;
  grade?: number;
}

export async function POST(req: NextRequest) {
  try {
    const body: RequestPayload = await req.json();
    const { messages, context, studentName, grade } = body;

    const lastUserMessage = [...(messages || [])].reverse().find((m) => m.role === 'user')?.content || '';

    // Check for Gemini API key in environment variables
    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    // If API key is available, attempt calling Gemini API
    if (apiKey) {
      try {
        const studentInfoPrompt = `
Hozir sen bilan gaplashayotgan bola ma'lumoti:
- Ismi: ${studentName || 'Bilimdon'}
- Sinfe: ${grade || 1}-sinf o'quvchisi
${context?.subject ? `- Fan: ${context.subject}` : ''}
${context?.topic ? `- Mavzu: ${context.topic}` : ''}
${context?.question ? `- Ishlayotgan savoli: "${context.question}"` : ''}
`;

        const fullSystemPrompt = `${SHERCHA_SYSTEM_PROMPT}\n${studentInfoPrompt}`;

        // Map chat messages to Gemini contents format
        const contents = (messages || []).map((msg) => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        }));

        // If contents is empty, add the last user message
        if (contents.length === 0 && lastUserMessage) {
          contents.push({
            role: 'user',
            parts: [{ text: lastUserMessage }],
          });
        }

        // Working models for this API key: gemini-3-flash-preview (fastest), then gemini-3.5-flash
        const models = ['gemini-3-flash-preview', 'gemini-3.5-flash'];
        let replyText = '';

        for (const model of models) {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5500);

            const geminiRes = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                signal: controller.signal,
                body: JSON.stringify({
                  systemInstruction: {
                    parts: [{ text: fullSystemPrompt }],
                  },
                  contents,
                  generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 800,
                  },
                }),
              }
            );

            clearTimeout(timeoutId);

            if (geminiRes.ok) {
              const data = await geminiRes.json();
              const candidate = data.candidates?.[0];
              const text = candidate?.content?.parts?.[0]?.text;
              if (text && text.trim().length > 0) {
                replyText = text.trim();
                break;
              }
            }
          } catch (modelErr) {
            console.warn(`Gemini model ${model} request error:`, modelErr);
          }
        }

        if (replyText) {
          return NextResponse.json({
            reply: replyText,
            source: 'gemini',
          });
        }
      } catch (geminiErr) {
        console.warn('Gemini API call failed, falling back to smart offline tutor:', geminiErr);
      }
    }

    // Fallback: Smart Kid Offline Tutor Engine
    const offlineReply = generateOfflineKidResponse(lastUserMessage, context);

    return NextResponse.json({
      reply: offlineReply,
      source: 'offline-smart',
    });
  } catch (error) {
    console.error('AI chat route error:', error);
    // Never crash for a child user: return friendly fallback
    return NextResponse.json({
      reply:
        "Salom, chempion! 🦁 Kichik texnik to'siq bo'ldi, lekin xavotir olma! Keling, misolni birgalikda o'qiymiz va sodda qilib yechamiz. Menga savolingni qaytadan yozib ko'r-chi! 🌟",
      source: 'offline-smart',
    });
  }
}
