/* 定数の設定を行います。
 */
const OPENAI_API_KEY =
  PropertiesService.getScriptProperties().getProperty("OPENAI_API_KEY");
if (!OPENAI_API_KEY) {
  throw new Error(
    "OpenAIのAPIキーが設定されていません。" +
      "「プロジェクト設定 > スクリプトプロパティ」より OPENAI_API_KEY を設定してください。"
  );
}

const CHANNEL_ACCESS_TOKEN =
  PropertiesService.getScriptProperties().getProperty("CHANNEL_ACCESS_TOKEN");
if (!CHANNEL_ACCESS_TOKEN) {
  throw new Error(
    "LINEのチャンネルアクセストークンが設定されていません。" +
      "「プロジェクト設定 > スクリプトプロパティ」より CHANNEL_ACCESS_TOKEN を設定してください。"
  );
}

const MODEL_ID =
  PropertiesService.getScriptProperties().getProperty("MODEL_ID");
if (!MODEL_ID) {
  throw new Error(
    "OpenAIのモデルIDが設定されていません。" +
      "「プロジェクト設定 > スクリプトプロパティ」より MODEL_ID (“gpt-3.5-turbo”など)を設定してください。" +
      "https://platform.openai.com/docs/models を参照してください。"
  );
}

/* LINEのWebhookを受け取る関数です。
ドキュメント: https://developers.google.com/apps-script/guides/web
 */
function doPost(e) {
  try {
    const json = JSON.parse(e.postData.contents);
    const replyToken = json.events[0].replyToken;
    const userId = json.events[0].source.userId;
    const userMessage = json.events[0].message.text;

    // LINEのメッセージをログに記録
    logToSheet("C", JSON.stringify(json));

    // ユーザーの入力をログに記録
    logToSheet("A", JSON.stringify({ role: "user", content: userMessage }));

    // LINEロードアニメーションを表示
    displayLoadingAnimation(userId, 10);

    const roleSetting =
      "あなたは数学の先生です。小学生にもわかるように説明してください。";
    // チャットの履歴をスプレッドシートから取得
    const chatLogs = getChatLogs("A");
    const assistantMessage = chatCompletions(
      roleSetting,
      chatLogs,
      userMessage
    );

    replyMessage(replyToken, assistantMessage);

    // アシスタントの出力をログに記録
    logToSheet(
      "A",
      JSON.stringify({ role: "assistant", content: assistantMessage })
    );

    return ContentService.createTextOutput(
      JSON.stringify({ content: "post ok" })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    logToSheet("B", error);
  }
}

/* LINEのメッセージを返信する関数です。
ドキュメント： https://developers.line.biz/en/reference/messaging-api/#send-reply-message
 */
function replyMessage(replyToken, message) {
  if (!replyToken) throw new Error("リプライトークンがありません");
  if (!message) throw new Error("メッセージがありません");
  return UrlFetchApp.fetch("https://api.line.me/v2/bot/message/reply", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + CHANNEL_ACCESS_TOKEN,
    },
    payload: JSON.stringify({
      replyToken,
      messages: [
        {
          type: "text",
          text: message,
        },
      ],
    }),
  });
}

/*
LINEのメッセージをプッシュする関数です。
ドキュメント： https://developers.line.biz/en/reference/messaging-api/#send-push-message
 */
function pushMessage(
  userId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  text = "こんにちは！"
) {
  return UrlFetchApp.fetch("https://api.line.me/v2/bot/message/push", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + CHANNEL_ACCESS_TOKEN,
    },
    payload: JSON.stringify({
      to: userId,
      messages: [
        {
          type: "text",
          text,
        },
      ],
    }),
  });
}

/* LINEのチャットでローディングアニメーションを表示する関数です。
ドキュメント: https://developers.line.biz/en/reference/messaging-api/#display-a-loading-indicator
 */
function displayLoadingAnimation(
  userId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  loadingSeconds = 5
) {
  return UrlFetchApp.fetch("https://api.line.me/v2/bot/chat/loading/start", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + CHANNEL_ACCESS_TOKEN,
    },
    payload: JSON.stringify({
      chatId: userId,
      loadingSeconds,
    }),
  });
}

/* OpenAI の completions API を使って、テキストを生成する関数です。
 */
function chatCompletions(
  roleSetting = "あなたは数学の先生です。小学生にもわかるように回答してください。",
  chatLogs = [],
  userMessage = "1+1は?"
) {
  var response = UrlFetchApp.fetch(
    "https://api.openai.com/v1/chat/completions",
    {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + OPENAI_API_KEY,
      },
      payload: JSON.stringify({
        model: MODEL_ID,
        max_tokens: 1000,
        messages: [
          {
            role: "system",
            content: roleSetting,
          },
          ...chatLogs,
          {
            role: "user",
            content: userMessage,
          },
        ],
      }),
    }
  );
  const json = JSON.parse(response.getContentText());
  return json.choices[0].message.content;
}

/* OpenAI の assistant API を使って、アシスタントを作成する関数です。
 */
function createAssistant() {
  var response = UrlFetchApp.fetch("https://api.openai.com/v1/assistants", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + OPENAI_API_KEY,
      "OpenAI-Beta": "assistants=v2",
    },
    payload: JSON.stringify({
      model: MODEL_ID,
      tools: [{ type: "code_interpreter" }], // code_interpreter か file_search か function を複数選択可能
      tool_resources: {
        code_interpreter: {},
      },
      name: "数学の家庭教師", // 最大256文字
      description: "数学の問題に答える先生", // アシスタントの概要。256文字以内。
      instructions:
        "あなたは数学の家庭教師です。質問に対してPythonのコードを実行し回答してください", // アシスタントへの指示。最大256,000文字。
      metadata: {}, // アシスタントのメタデータ
      top_p: 1.0, // 数字が大きいほどランダムになる
      temperature: 1.0, // 0.0 ~ 2.0 で数字が大きいほどランダムになる
      response_format: "auto", // auto か text か json_object
    }),
  });
  var assistant = JSON.parse(response.getContentText());
  console.log(assistant);
  return assistant;
}

/* OpenAI API で作成したアシスタントの一覧を取得する関数です。
 */
function listAssistant() {
  var response = UrlFetchApp.fetch("https://api.openai.com/v1/assistants", {
    method: "get",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + OPENAI_API_KEY,
      "OpenAI-Beta": "assistants=v2",
    },
  });
  var assistants = JSON.parse(response.getContentText());
  console.log(assistants);
  return assistants["data"];
}

/* ログをスプレッドシートに書き込む関数です。
 */
function logToSheet(column, text) {
  const logSheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (logSheet.getRange(column + "1").getValue() == "") {
    lastRow = 0;
  } else if (logSheet.getRange(column + "2").getValue() == "") {
    lastRow = 1;
  } else {
    var lastRow = logSheet
      .getRange(column + "1")
      .getNextDataCell(SpreadsheetApp.Direction.DOWN)
      .getRow();
    // 無限に増えるので1000以上書き込んだらリセット
    console.log("lastRow", lastRow);
    if (lastRow >= 1000) {
      logSheet.getRange(column + "1:" + column + "10").clearContent();
      lastRow = 0;
    }
  }
  var putRange = column + String(lastRow + 1);
  logSheet.getRange(putRange).setValue(text);
}

/* チャットログのカラムの最終行から最大10行を取得する関数です。
 */
function getChatLogs(column = "A") {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  const lastRow = sheet.getLastRow();
  const chatLogs = sheet
    .getRange(column + "1" + ":" + column + lastRow)
    .getValues();
  let flattend = chatLogs.flat();
  if (flattend.length > 10) flattened = flattend.slice(-10);
  flattend = flattend.map((logString) => JSON.parse(logString));
  return flattend;
}
