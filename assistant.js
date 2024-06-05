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

  const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
    assistant_id: assistant.id,
    instructions: "この数式をJavascriptで解いてください。",
  });

  const messages = await openai.beta.threads.messages.list(run.thread_id);

  for (const message of messages.data.reverse()) {
    console.log(`${message.role} > ${message.content[0].text.value}`);
  }
}

main();

// 出力
// user > 先生、3x + 11 = 14 の x の値を教えてください。
// assistant > この方程式を解くために、以下の手順を踏みます：

// 1.  \(3x + 11 = 14\) の両辺から 11 を引きます。
// 2. 残った方程式を \(3x = 14 - 11\) とします。
// 3. 解が \(3x = 3\) になります。
// 4. 両辺を 3 で割って \(x = 1\) と求めます。

// この手順を使って、JavaScriptで解を求める方法を示します:

// ```javascript
// // 方程式 3x + 11 = 14 の解を求める

// // 1. 両辺から 11 を引く
// let leftSideReduced = 3 * x;
// let rightSideReduced = 14 - 11;

// // 2. 残った方程式を解く
// let x = rightSideReduced / 3;

// console.log("x の値は: ", x);
// ```

// このコードを実行すると、 `x` の値が `1` であることが確認できるでしょう。
