# OpenAI Playground

生成AIワークショップ用の実装です。

## チュートリアル

[1. イントロダクション](tutorial/1-introcution.md)

[2. OpenAI API の使い方](tutorial/2-how-to-use.md)

[3. API の利用料金](tutorial/3-pricing.md)

[4. APIキーの取得方法](tutorial/4-get-api-key.md)

## 環境設定

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
1. `gpt4oImageProcessing.js` 数学の画像を解かせる対話
1. `textToSpeech.js` 日本語テキストを日本語音声に変換
1. `speechToText.js` 日本語音声をテキストに変換
1. `translation.js` 日本語音声を英語テキストに変換
1. `imageRecognition.js` 画像に映る建物を認識
1. `compreImages.js` 画像に映る建物が同じかを回答
1. `generatingImage.js` テキストからロゴ画像を出力
1. `text-embedding.js` テキストをベクトルに変換
1. `moderation.js` 悪意のある入力であるかを判定
1. `assistant.js` 数学の先生が数学の問題に答える対話
1. `assistantWithStreaming.js` assistant.jsのストリーミング出力版
1. `createFineTuningJob.js` CSVデータを使ったファインチューニング
1. `fileSeach.js` ウェブサイトをプリントしたPDFを読み回答
1. `lineBot.gs` ユーザの入力を記憶し、返答するLINEボット
1. `ojousamaBot.js` お嬢様の対話データを使ったファインチューニング