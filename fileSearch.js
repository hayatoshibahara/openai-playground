import OpenAI from "openai";
import fs from "fs";
const openai = new OpenAI();

async function main() {
  const assistant = await openai.beta.assistants.create({
    name: "コミュニティマネージャー",
    instructions: "あなたはエンジニアカフェのコミュニティマネージャです",
    model: "gpt-4o",
    tools: [{ type: "file_search" }],
  });
  // A user wants to attach a file to a specific message, let's upload it.
  const engineerCafePdf = await openai.files.create({
    file: fs.createReadStream("pdf/engineer-cafe.pdf"),
    purpose: "assistants",
  });

  const thread = await openai.beta.threads.create({
    messages: [
      {
        role: "user",
        content: "エンジニアカフェについて教えて",
        // Attach the new file to the message.
        attachments: [
          { file_id: engineerCafePdf.id, tools: [{ type: "file_search" }] },
        ],
      },
    ],
  });

  // The thread now has a vector store in its tool resources.
  console.log(thread.tool_resources?.file_search);

  const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
    assistant_id: assistant.id,
  });

  const messages = await openai.beta.threads.messages.list(thread.id, {
    run_id: run.id,
  });

  const message = messages.data.pop();
  if (message.content[0].type === "text") {
    const { text } = message.content[0];
    const { annotations } = text;
    const citations = [];

    let index = 0;
    for (let annotation of annotations) {
      text.value = text.value.replace(annotation.text, "[" + index + "]");
      const { file_citation } = annotation;
      if (file_citation) {
        const citedFile = await openai.files.retrieve(file_citation.file_id);
        citations.push("[" + index + "]" + citedFile.filename);
      }
      index++;
    }

    console.log(text.value);
    console.log(citations.join("\n"));
  }
}

main();
