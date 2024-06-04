import OpenAI from "openai";

const openai = new OpenAI();

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "あなたは面白いアプリケーションの作り方を教えてくれる伝説的ハッカーです",
      },
      { role: "user", content: "面白いアプリの作り方を教えて" },
    ],
    model: "gpt-4o",
  });

  console.log(completion.choices[0].message.content);
}

main();
