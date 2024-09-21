// import { generateText } from "ai";

import { google } from "@ai-sdk/google";
import { streamText, StreamData } from "ai";
import { NextResponse } from "next/server";
const model = google("gemini-1.5-flash-latest");

// export const GET = async () => {
//   try {
//     // const { text } = await generateText({
//     //   model: google("gemini-1.5-flash-latest"),
//     //   prompt: "Write a vegetarian lasagna recipe for 4 people.",
//     // });
//     const { textStream } = await streamText({
//       model: google("gemini-1.5-flash-latest"),
//       prompt: "Write a poem about embedding models.",
//     });

//     return Response.json(text);
//   } catch (error: any) {
//     return Response.json(error.message);
//   }
// };

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function GET(req: Request) {
  const prompt =
    "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

  try {
    // Create a new StreamData
    const data = new StreamData();

    // Append additional data
    data.append({ test: "value" });

    // Call the language model
    const result = await streamText({
      model: google("gemini-1.5-flash-latest"),
      onFinish() {
        data.close();
      },
      prompt,
    });
    const { text } = result;
    console.log(text);
    // Respond with the stream and additional StreamData
    return result.toDataStreamResponse({ data });
  } catch (error) {
    return NextResponse.json({ message: "something is not working" });
  }
}
