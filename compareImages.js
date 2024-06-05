import OpenAI from "openai";
import fs from "fs";

const openai = new OpenAI();

async function main() {
  const akarengaImage1 = "image/akarenga.jpg";
  const akarengaImage2 = "image/akarenga.jpg";

  const imageBuffer1 = fs.readFileSync(akarengaImage1);
  const imageBuffer2 = fs.readFileSync(akarengaImage2);

  const base64Image1 = imageBuffer1.toString("base64");
  const base64Image2 = imageBuffer2.toString("base64");

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "この二つの建物は同じですか？" },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64Image1}`,
            },
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64Image2}`,
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
// はい、これら二つの画像は同じ建物です。
// 同じ角度、照明、建物のディテールが一致しています。
// したがって、これらの画像は同一の建物を表しています。
