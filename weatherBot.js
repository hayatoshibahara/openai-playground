import OpenAI from "openai";

const openai = new OpenAI();

function dummyWeatherAPI(location) {
  if (location.includes("東京")) {
    return JSON.stringify({
      location: "東京",
      temperature: "18",
      weather: "晴",
    });
  }

  if (location.includes("大阪")) {
    return JSON.stringify({
      location: "大阪",
      temperature: "20",
      weather: "曇り",
    });
  }

  if (location.includes("福岡")) {
    return JSON.stringify({
      location: "福岡",
      temperature: "22",
      weather: "雨",
    });
  }

  return JSON.stringify({ location, temperature: "不明", weather: "不明" });
}

async function main() {
  const messages = [
    {
      role: "user",
      content: "福岡の気温を教えて！",
    },
  ];
  console.log("ユーザの入力:", messages[0].content);
  // 最初の返答を取得
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages,
    // toolsにお天気APIのパラメータを定義を追加
    tools: [
      {
        type: "function",
        function: {
          name: "get_current_weather",
          description: "日本の特定の場所の現在の天気を取得する",
          parameters: {
            type: "object",
            properties: {
              location: {
                type: "string",
                description: "日本の地名",
              },
            },
            required: ["location"],
          },
        },
      },
    ],
    tool_choice: "auto",
  });

  const responseMessage = response.choices[0].message;
  const toolCalls = responseMessage.tool_calls;

  if (!toolCalls) {
    throw new Error("関数の呼び出しに失敗しました");
  }

  for (const toolCall of toolCalls) {
    const availableFunctions = {
      get_current_weather: dummyWeatherAPI,
    };

    // メッセージのやりとりの追加
    messages.push(responseMessage);

    const functionName = toolCall.function.name;
    const functionToCall = availableFunctions[functionName];
    const functionArgs = JSON.parse(toolCall.function.arguments);
    const functionResponse = functionToCall(functionArgs.location);

    console.log("呼び出す関数名:", functionName);

    // 呼び出す関数を追加
    messages.push({
      tool_call_id: toolCall.id,
      role: "tool",
      name: functionName,
      content: functionResponse,
    });
  }

  // 関数の出力を加味した返答を取得
  const secondResponse = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: messages,
  });
  return secondResponse.choices;
}

// 福岡の現在の気温は22度で、雨が降っています。お出かけの際には傘をお持ちくださいね。
const response = await main();
console.log("回答:", response[0].message.content);
