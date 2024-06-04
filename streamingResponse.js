import OpenAI from "openai";

const openai = new OpenAI();

async function main() {
  const stream = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: "こんにちは！いいお天気ですね！",
      },
    ],
    // Server Sent Events (SSE) are used to stream the response
    stream: true,
  });

  for await (const chunk of stream) {
    console.log(chunk.choices[0]?.delta?.content || "");
  }
}

main();
