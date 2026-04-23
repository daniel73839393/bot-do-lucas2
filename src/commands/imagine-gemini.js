import { AttachmentBuilder } from "discord.js";
import { gemini } from "../clients.js";

export async function handleImagineGemini(i) {
  if (!gemini) {
    return i.reply({
      content: "Gemini não configurado. Adicione GEMINI_API_KEY no .env.",
      ephemeral: true,
    });
  }
  const prompt = i.options.getString("prompt", true);
  const hq = i.options.getBoolean("hq") ?? false;
  const model = hq ? "gemini-3-pro-image-preview" : "gemini-2.5-flash-image";

  await i.deferReply();
  const response = await gemini.models.generateContent({
    model,
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  const parts = response.candidates?.[0]?.content?.parts ?? [];
  const imgPart = parts.find((p) => p.inlineData?.data);
  const b64 = imgPart?.inlineData?.data;
  if (!b64) throw new Error("Gemini não retornou imagem.");

  const file = new AttachmentBuilder(Buffer.from(b64, "base64"), {
    name: "gemini.png",
  });
  await i.editReply({
    content: `**Gemini ${model}** — \`${prompt}\``,
    files: [file],
  });
}
