import fs from "fs";
import path from "path";
import OpenAI from "openai";

const openai = new OpenAI();

const speechFile = path.resolve("audio/speech.mp3");

async function main() {
  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "alloy",
    input:
      "福岡市をエンジニアの聖地にしよう。エンジニアカフェは、そんな想いが起点となって生まれた官民一体のプロジェクトです。エンジニア・エコシステム個人やコミュニティを核としたエンジニア・エコシステムを創造していくべく、多様性を求め、出会いが成長や協業へ繋がり、玉石混交なアウトプットが次々に生み出される場所です。個人やコミュニティをサポートエンジニアやエンジニアに関わる方、エンジニアを目指す方からのさまざまな相談に対応、活躍できる環境づくりをサポートいたします。",
  });
  console.log("音声を出力しました", speechFile);
  const buffer = Buffer.from(await mp3.arrayBuffer());
  await fs.promises.writeFile(speechFile, buffer);
}

main();
