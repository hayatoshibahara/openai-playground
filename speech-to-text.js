import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI();

async function main() {
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream("audio/speech.mp3"),
    model: "whisper-1",
  });

  console.log("音声からテキストに変換しました:", transcription.text);
}

main();

// 出力例
// 音声からテキストに変換しました: 複語歌詞をエンジニアの聖地にしよう
// エンジニアカフェはそんな思いが起点となって生まれた 官民一体のプロジェクトです
// エンジニアエコシステム個人やコミュニティを核とした エンジニアエコシステムを創造していくべく
// 多様性を求め、出会いが成長や協業へつながり 手無敵効果なアウトプットが次々に生み出される場所です
// 個人やコミュニティをサポート エンジニアやエンジニアに関わる方
// エンジニアを目指す方からの様々な相談に対応 活躍できる環境づくりをサポートいたします
