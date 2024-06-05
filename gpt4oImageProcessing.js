import OpenAI from "openai";
import fs from "fs";

const openai = new OpenAI();

async function main() {
  // 数学の問題の画像を読み込み、base64エンコードする
  const mathQuestionImage = "image/math-question.png";
  const imageBuffer = fs.readFileSync(mathQuestionImage);
  const base64Image = imageBuffer.toString("base64");

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "あなたは宿題の手伝いをしてくれる家庭教師AIです。",
      },
      {
        role: "user",
        content: [
          { type: "text", text: "画像の三角形の面積を求めてください。" },
          {
            type: "image_url",
            image_url: {
              url: `data:image/png;base64,${base64Image}`,
            },
          },
        ],
      },
    ],
    model: "gpt-4o",
  });

  console.log(completion.choices[0].message.content);
}

main();
