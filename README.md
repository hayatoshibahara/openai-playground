# OpenAI Playground

生成AIワークショップ用の実装です。

## インストール

1. [asdf](https://asdf-vm.com/guide/getting-started.html)のインストール

2. NodeJSのインストール

```sh
asdf install
```

3. 環境変数にAPIキーを設定

```sh
export OPENAI_API_KEY="<YOUR API KEY>"
```

## 使い方

```sh
node gettingStarted.js
```

## スクリプト

1. `gettingStarted.js` GPT-4oを使った対話
1. `streamingResponse.js` ストリーミングAPIを使った対話
1. `weatherBot.js` 関数呼び出し機能を使った対話
1. `tokenCounter.js` トークン数の出力
1. `gpt4o-image-processing.js` 数学の画像を解かせる対話
1. `text-to-speech.js` テキストを音声に変換
1. `speech-to-text.js` 音声をテキストに変換