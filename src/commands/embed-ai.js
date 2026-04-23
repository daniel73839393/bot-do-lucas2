import { EmbedBuilder } from "discord.js";
import { openai } from "../clients.js";

export async function handleEmbedAi(i) {
  if (!openai) {
    return i.reply({
      content: "OpenAI não configurado. Adicione OPENAI_API_KEY no .env.",
      ephemeral: true,
    });
  }
  const topic = i.options.getString("tema", true);
  await i.deferReply();

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    max_tokens: 1500,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "Você gera embeds para Discord. Responda SOMENTE JSON com este formato: " +
          `{"title": string (máx 240), "description": string (máx 3500, em português, informativo e bem formatado), "hex": string (cor hex de 6 chars sem #, escolhida pelo tema), "image": string|null (URL pública .png/.jpg ilustrativa, ou null), "thumbnail": string|null (URL de ícone/logo, ou null), "footer": string|null (frase curta de rodapé)}.` +
          " Não inclua texto fora do JSON. Não invente URLs — se não tiver certeza, use null.",
      },
      { role: "user", content: `Tema do embed: ${topic}` },
    ],
  });

  const raw = completion.choices[0]?.message?.content?.trim() ?? "{}";
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error("IA retornou JSON inválido.");
  }

  const hex = /^[0-9a-fA-F]{6}$/.test(data.hex ?? "")
    ? parseInt(data.hex, 16)
    : 0x5865f2;

  const embed = new EmbedBuilder()
    .setTitle((data.title || topic).slice(0, 256))
    .setDescription((data.description || " ").slice(0, 4000))
    .setColor(hex)
    .setTimestamp();

  if (data.image && /^https?:\/\//.test(data.image)) embed.setImage(data.image);
  if (data.thumbnail && /^https?:\/\//.test(data.thumbnail))
    embed.setThumbnail(data.thumbnail);
  embed.setFooter({ text: (data.footer ?? "Gerado por IA").slice(0, 2048) });

  await i.editReply({ embeds: [embed] });
}
