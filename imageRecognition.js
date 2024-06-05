import OpenAI from "openai";
import fs from "fs";

const openai = new OpenAI();

async function main() {
  const akarengaImage = "image/akarenga.jpg";

  const imageBuffer = fs.readFileSync(akarengaImage);

  const base64Image = imageBuffer.toString("base64");

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "画像の中にあるものは何ですか？" },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`,
            },
          },
        ],
      },
    ],
  });
  console.log(response.choices[0].message.content);
}

main();

// 出力
// この画像に写っている建物は、日本にある歴史的な建築物です。
// 赤レンガと石を組み合わせたデザインが特徴で、ドーム型の屋根や古典的な装飾が施されています。
// このような建物は明治時代から大正時代にかけて建てられたものが多く、レトロな雰囲気を持っています。
// 具体的な場所や名称については明言できませんが、このような建築様式はかつての官公庁、銀行、図書館、
// 博物館などでよく見られることが多いです。
