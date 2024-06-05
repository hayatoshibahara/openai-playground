import OpenAI from "openai";

async function main() {
  const openai = new OpenAI();

  const response = await openai.moderations.create({
    model: "text-moderation-latest",
    input: "この文章は問題がありますか",
  });

  console.log(response.results[0].flagged);
  console.log(response.results[0].categories);
}

main();

// 出力
// false
// {
//   sexual: false,
//   hate: false,
//   harassment: false,
//   'self-harm': false,
//   'sexual/minors': false,
//   'hate/threatening': false,
//   'violence/graphic': false,
//   'self-harm/intent': false,
//   'self-harm/instructions': false,
//   'harassment/threatening': false,
//   violence: false
// }
