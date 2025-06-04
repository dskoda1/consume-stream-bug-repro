import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
    const { messages } = await req.json();
    req.signal.addEventListener("abort", () => {
        console.log("aborted")
      });
  
    console.log("Starting stream")
    const result = streamText({
      model: openai('gpt-4o'),
      messages,
      abortSignal: req.signal,
      onChunk: (chunk) => {
        console.log({chunk})
      },
      onFinish: ({ response }) => {
        console.log({finished: response})
      }
    });

    // This should according to docs keep the request alive but if the client disconnects
    // during a long stream the api route is immediately ended and "aborted" is logged
    result.consumeStream();

    return result.toDataStreamResponse();
  }