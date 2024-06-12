// CSV をダウンロードし、 data ディレクトリに保存してください。
// https://github.com/openai/openai-cookbook/blob/main/examples/data/cookbook_recipes_nlg_10k.csv

import fs from "fs";
import OpenAI from "openai";
import Papa from "papaparse";

const openai = new OpenAI();

function createUserMessage(row) {
  const title = row["title"];
  const ingredients = row["ingredients"];
  return `Title: ${title}\n\nIngredients: ${ingredients}\n\nGeneric ingredients: `;
}

function prepareExampleConversation(row) {
  const messages = [];

  // システムメッセージの追加
  const systemMessage =
    "You are a helpful recipe assistant.\
  You are to extract the generic ingredients from each of the recipes provided.";
  messages.push({
    role: "system",
    content: systemMessage,
  });

  // ユーザーメッセージの追加
  const userMessage = createUserMessage(row);
  messages.push({
    role: "user",
    content: userMessage,
  });

  messages.push({
    role: "assistant",
    content: row["NER"],
  });

  return { messages };
}

async function checkJobStatus(jobId) {
  if (jobId) {
    const job = await openai.fineTuning.jobs.retrieve(jobId);
    console.log(job.status);
    return;
  }
  const jobsResponse = await openai.fineTuning.jobs.list();
  for (const job of jobsResponse.data) {
    console.log(job.id, job.status);
  }
}

async function main() {
  // CSVのロード
  const csvPath = "data/cookbook_recipes_nlg_10k.csv";
  const csvFile = fs.readFileSync(csvPath, "utf-8");

  // ファインチューニング用のデータ作成用
  const trainingDataPath = "data/tmpRecipeFinetuneTraining.jsonl";
  const validationDataPath = "data/tmpRecipeFinetuneValidation.jsonl";

  if (!fs.existsSync(csvPath)) {
    console.error(
      "data/cookbook_recipes_nlg_10k.csv が存在しません。\
    cookbook_receipes_nlg_10k.csv をダウンロードし、 data ディレクトリに保存してください。\
    https://github.com/openai/openai-cookbook/blob/main/examples/data/cookbook_recipes_nlg_10k.csv"
    );
  }

  const data = await new Promise((resolve, reject) =>
    Papa.parse(csvFile, {
      header: true,
      delimiter: ",",
      complete: function (results) {
        const rows = results.data;
        resolve(rows.map(prepareExampleConversation));
      },
      error: function (error) {
        reject(error);
      },
    })
  );

  const training_jsonl = data
    .slice(0, 100)
    .map((row) => JSON.stringify(row))
    .join("\n");
  const validation_jsonl = data
    .slice(100, 200)
    .map((row) => JSON.stringify(row))
    .join("\n");

  fs.writeFileSync(trainingDataPath, training_jsonl);
  fs.writeFileSync(validationDataPath, validation_jsonl);

  const trainingData = fs.readFileSync(trainingDataPath, "utf-8");

  const uploadTrainingDataResponse = await openai.files.create({
    file: fs.createReadStream(trainingDataPath),
    purpose: "fine-tune",
  });
  const trainingDataId = uploadTrainingDataResponse.id;

  const uploadValidationDataResponse = await openai.files.create({
    file: fs.createReadStream(validationDataPath),
    purpose: "fine-tune",
  });
  const validationDataId = uploadValidationDataResponse.id;

  const fineTuneJobResponse = await openai.fineTuning.jobs.create({
    training_file: trainingDataId,
    validation_file: validationDataId,
    model: "gpt-3.5-turbo",
  });

  const jobId = fineTuneJobResponse.id;

  // ファインチューニングは数分〜数時間かかる
  // 失敗・完了したらメールが届く
  setInterval(async () => {
    await checkJobStatus(jobId);
  }, 10000);
}

main();
