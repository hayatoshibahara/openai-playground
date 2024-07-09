// お嬢様トークスクリプトデータセット
// https://github.com/matsuvr/OjousamaTalkScriptDataset

import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI();

async function checkJobStatus(jobId) {
  if (jobId) {
    const job = await openai.fineTuning.jobs.retrieve(jobId);
    console.log(`進行状況: ${job.status}`);
    return;
  }
  const jobsResponse = await openai.fineTuning.jobs.list();
  for (const job of jobsResponse.data) {
    console.log(`ジョブID ${job.id} の進行状況: ${job.status}`);
  }
}

async function main() {
  const dataPath = "data/ojousama.jsonl";
  const data = fs.readFileSync(dataPath, "utf-8").split("\n");

  const trainingDataPath = "data/tmpOjousamaFinetuneTraining.jsonl";
  const validationDataPath = "data/tmpOjousamaFinetuneValidation.jsonl";

  if (!fs.existsSync(dataPath)) {
    throw new Error(
      "data/ojousama.jsonl が存在しません。\
    ojousama.jsonl をダウンロードし、 data ディレクトリに保存してください。\
    https://github.com/matsuvr/OjousamaTalkScriptDataset/blob/main/ojousamatalkscript200_gpt-3.5-1106ver.jsonl"
    );
  }

  const training_jsonl = data.slice(0, 100).join("\n");
  const validation_jsonl = data.slice(100, 200).join("\n");

  fs.writeFileSync(trainingDataPath, training_jsonl);
  fs.writeFileSync(validationDataPath, validation_jsonl);

  const uploadTrainingDataResponse = await openai.files.create({
    file: fs.createReadStream(trainingDataPath),
    purpose: "fine-tune",
  });
  const trainingDataId = uploadTrainingDataResponse.id;
  console.log(
    "学習データをアップロードしました。" +
      "Dashboard > Storage からファイルを確認できます。" +
      `ファイルID: ${trainingDataId}`
  );

  const uploadValidationDataResponse = await openai.files.create({
    file: fs.createReadStream(validationDataPath),
    purpose: "fine-tune",
  });
  const validationDataId = uploadValidationDataResponse.id;
  console.log(
    "検証データをアップロードしました。" +
      "Dashboard > Storage からファイルを確認できます。" +
      `ファイルID: ${validationDataId}`
  );

  const fineTuneJobResponse = await openai.fineTuning.jobs.create({
    training_file: trainingDataId,
    validation_file: validationDataId,
    model: "gpt-3.5-turbo",
  });
  const jobId = fineTuneJobResponse.id;
  console.log(
    "ファインチューニングジョブを開始しました。" +
      "完了まで数分〜数時間かかります。失敗・完了後にメールが届きます。" +
      "進行状況は Dashboard > Fine-tuning から確認できます。" +
      "完了後、 Dashboard > Assistans から動作検証できます。"
  );

  checkJobStatus(jobId);
  setInterval(async () => {
    await checkJobStatus(jobId);
  }, 10000);
}

main();
