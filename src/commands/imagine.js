import { AttachmentBuilder } from "discord.js";
import { openai } from "../clients.js";

export async function handleImagine(i) {
  if (!openai) {
    return i.reply({
      content: "OpenAI não configurado. Adicione OPENAI_API_KEY no .env.",
      ephemeral: true,
    });
  }
  const prompt = i.options.getString("prompt", true);
  const size = i.options.getString("size") ?? "1024x1024";

  await i.deferReply();
  const result = await openai.images.generate({
    model: "gpt-image-1",
    prompt,
    size,
  });
  const b64 = result.data?.[0]?.b64_json;
  if (!b64) throw new Error("OpenAI não retornou imagem.");

  const file = new AttachmentBuilder(Buffer.from(b64, "base64"), {
    name: "openai.png",
  });
  await i.editReply({
    content: `**OpenAI gpt-image-1** — \`${prompt}\``,
    files: [file],
  });
}
