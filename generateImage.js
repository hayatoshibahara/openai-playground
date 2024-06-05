import OpenAI from "openai";
import axios from "axios";
import fs from "fs";

async function main() {
  const openai = new OpenAI();

  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: "日本の福岡市のエンジニアカフェのロゴを作成してください",
    n: 1,
    size: "1024x1024",
  });

  console.log(response);

  console.log("プロンプトの改定", response.data[0]["revised_prompt"]);
  const imageUrl = response.data[0].url;
  console.log(imageUrl);

  const imageResponse = await axios({
    method: "GET",
    url: imageUrl,
    responseType: "stream",
  });

  const imagePath = "image/engineer-cafe.png";
  const writer = fs.createWriteStream(imagePath);

  imageResponse.data.pipe(writer);

  await new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });

  console.log("画像を出力しました", imagePath);

  return;
}

main();
