import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI();

async function main() {
  const translation = await openai.audio.translations.create({
    file: fs.createReadStream("audio/speech.mp3"),
    model: "whisper-1",
    targetLanguage: "en",
  });

  console.log(translation.text);
}
main();

// 出力
// Let's make Fukuoka City the holy land of engineers.
// Engineer Café is a one-of-a-kind project that was born from such a desire.
// In order to create an engineer ecosystem that is individual and
// community-based, it is a place where diversity leads to meeting, growth,
// and cooperation, and where a variety of outputs are created one
// after another. We support individuals and communities, and we support the
// creation of an environment where people who are involved in engineering,
// people who are interested in engineering, and people who want to become
// engineers can support various consultations and activities.
