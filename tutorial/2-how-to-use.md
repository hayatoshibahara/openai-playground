# 2. OpenAI API の使い方

トップページの Products > API Login を辿る

![](image/api-login.png)

API を選択

![](image/api.png)

Playground が表示されるが、Docs を選択

![](image/docs.png)

左のメニューから Overview を選択し、 Developer quickstart を選択

![](image/developer-quickstart.png)

今回は Developer quickstart を使い、実際に API を試してみる

![](image/tutorial.png)

開発言語は任意だが、ウェブアプリケーションの場合は Node.js がおすすめ。

![](image/language.png)

## Node.js の場合

Node.js のインストール

![](image/install-nodejs.png)

Node.js の公式サイトに行きインストール。バージョンは安定版（LTS）がおすすめ。

![](image/download-node-js.png)

```sh
# 適当にディレクトリを作成し移動
mkdir openai-example
cd openadi-example

# プロジェクトを初期化
npm init -y

# OpenAI Node.js ライブラリをインストール
npm install --save openai
```

![](image/install-openai-library.png)

API キーを環境変数に設定

```sh
# 最新の MacOS の場合
vim ~/.zshrc
# もしくはテキスト編集でも OK
open ~/.zshrc
```

`.zshrc` の末尾に以下を設定

```sh
export OPENAI_API_KEY='ここにAPIキーを入力してください'
```

忘れずに反映

```sh
source ~/.zshrc

# APIキーが出力されれば成功
echo $OPENAI_API_KEY
```

![](image/set-up-api-key.png)

`package.json` に`"type": "module"`を追加

```json
{
  "name": "openai-example",
  "type": "module", // これだけ追加
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "openai": "^4.54.0"
  }
}
```

ChatCompletions API を使ったプログラムを作成。
※ その他にもベクトル抽出（Embedding）、画像生成（Images）も試せる。

```js
// openai-test.js
import OpenAI from "openai";

const openai = new OpenAI();

async function main() {
  const completion = await openai.chat.completions.create({
    // GPT-4o mini を使い、天才科学者を演じさせる
    messages: [{ role: "system", content: "あなたは天才科学者です" }],
    model: "gpt-4o-mini",
  });

  console.log(completion.choices[0]);
}

main();
```


![](image/first-request.png)

API を実行

```sh
node openai-test.js
```

以下が表示されると成功


```js
{
  index: 0,
  message: {
    role: 'assistant',
    content: 'はい、私は天才科学者として様々な科学や技術に関する質問にお答えします。何か特定のトピックや質問がありますか？'
  },
  logprobs: null,
  finish_reason: 'stop'
}
```

参考：

ユーザの入力やボットの回答を含めて、新しい回答を作成するのが ChatCompletions API を使った開発

```js
// openai-test.js
import OpenAI from "openai";

const openai = new OpenAI();

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [
    // GPT-4o mini を使い、天才科学者を演じさせる
    { role: "system", content: "あなたは天才科学者です" },
    // ユーザーの入力を追加
    { role: "user", content: "学校で数学を勉強しています。" },
    // ボットの返答を追加
    { role: "assistant", content: "どのような勉強をしていますか？" },
    // 新しいユーザの入力を追加
    { role: "user", content: "最近は波動方程式を勉強していますが難しくって..." }
    ],
    model: "gpt-4o-mini",
  });

  console.log(completion.choices[0]);
}

main();
```

```sh
node openai-test.js
```

実行すると文脈を踏まえた回答を生成できる。

```js
{
  index: 0,
  message: {
    role: 'assistant',
    content: '波動方程式は確かに難しい概念ですが、理解すると非常に面白く、役立つものです。波動方程式は、さまざまな物理現象、例えば音波や光波、さらには水の波などを表現するために使われます。具体的な質問や困っている点があれば教えてください。できる限りお手伝いしますよ！'
  },
  logprobs: null,
  finish_reason: 'stop'
}
```

他の簡単の実装例もこのリポジトリ内にあるので参考にしてみてください！