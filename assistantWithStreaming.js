import OpenAI from "openai";
const openai = new OpenAI();

async function main() {
  const assistant = await openai.beta.assistants.create({
    name: "数学の先生",
    instructions: "あなたは数学の家庭教師です。",
    tools: [{ type: "code_interpreter" }],
    model: "gpt-4o",
  });

  const thread = await openai.beta.threads.create();

  const message = await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: "先生、3x + 11 = 14 の x の値を教えてください。",
  });

  const run = openai.beta.threads.runs
    .stream(thread.id, {
      assistant_id: assistant.id,
    })
    .on("textCreated", (text) => console.log("\n先生 > "))
    .on("textDelta", (textDelta, snapshot) => console.log(textDelta.value))
    .on("toolCallCreated", (toolCall) =>
      console
        .log(`\nassistant > ${toolCall.type}\n\n`)
        .on("toolCallDelta", (toolCallDelta, snapshot) => {
          if (toolCallDelta.code_interpreter.input) {
            console.log(toolCallDelta.code_interpreter.input);
          }
          if (toolCallDelta.code_interpreter.outputs) {
            console.log("\n出力 > \n");
          }
        })
    )
    .on("toolCallDelta", (toolCallDelta, snapshot) => {
      if (toolCallDelta.code_interpreter.input) {
        console.log(toolCallDelta.code_interpreter.input);
      }

      if (toolCallDelta.code_interpreter.outputs) {
        console.log("\n出力 > \n");
        toolCallDelta.code_interpreter.outputs.forEach((output) => {
          if (output.type === "log") {
            console.log(`\n${output.logs}\n`);
          }
        });
      }
    });
}

main();

// ストリーム出力
// 先生 >
// 方
// 程
// 式
//  \(
// 3
// x
//  +

// 11
//  =

// 14
// \
// )
//  を
// 解
// いて
// 、
// \(
// x
// \
// )
//  の
// 値
// を
// 求
// め
// ま
// しょう
// 。

// まず
// 、
// 方
// 程
// 式
// から
// 定
// 数
// を
// 取り
// 除
// く
// こと
// が
// 必要
// です
// 。
// 以下
// の
// よう
// に
// 進
// め
// ます
// ：

// 1
// .
//  方
// 程
// 式
// から
// 11
// を
// 引
// いて
// 、
// 定
// 数
// を
// 消
// します
// 。

// \[
// 3
// x
//  +

// 11
//  -

// 11
//  =

// 14
//  -

// 11
// \
// ]

// これ
// で
// 次
// の
// よう
// になります
// ：

// \[
// 3
// x
//  =

// 3
// \
// ]

// 2
// .
//  次
// に
// 係
// 数
// 3
// で
// 両
// 辺
// を
// 割
// って
// 、
// \(
// x
// \
// )
//  の
// 値
// を
// 求
// め
// ます
// 。

// \[
// x
//  =
//  \
// frac
// {
// 3
// }{
// 3
// }\
// ]

// これ
// で
// 確
// か
// に
// ：

// \[
// x
//  =

// 1
// \
// ]

// \(
// x
// \
// )
//  の
// 値
// は
// 1
// です
// 。
