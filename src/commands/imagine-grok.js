import { AttachmentBuilder } from "discord.js";
import { grok } from "../clients.js";

export async function handleImagineGrok(i) {
  if (!grok) {
    return i.reply({
      content:
        "Grok não configurado. Adicione GROK_API_KEY no .env (pegue em https://console.x.ai).",
      ephemeral: true,
    });
  }
  const prompt = i.options.getString("prompt", true);
  await i.deferReply();
  const result = await grok.images.generate({
    model: "grok-2-image",
    prompt,
    response_format: "b64_json",
  });
  const b64 = result.data?.[0]?.b64_json;
  if (!b64) throw new Error("Grok não retornou imagem.");

  const file = new AttachmentBuilder(Buffer.from(b64, "base64"), {
    name: "grok.png",
  });
  await i.editReply({
    content: `**Grok grok-2-image** — \`${prompt}\``,
    files: [file],
  });
}
