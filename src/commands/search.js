import { EmbedBuilder } from "discord.js";
import { openai } from "../clients.js";

export async function handleSearch(i) {
  if (!openai) {
    return i.reply({
      content: "OpenAI não configurado. Adicione OPENAI_API_KEY no .env.",
      ephemeral: true,
    });
  }
  const query = i.options.getString("query", true);
  await i.deferReply();

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    max_tokens: 1500,
    messages: [
      {
        role: "system",
        content:
          "Você é um assistente de pesquisa. Responda de forma clara, factual e organizada em português. Quando útil, use marcadores. Seja objetivo.",
      },
      { role: "user", content: query },
    ],
  });

  const answer =
    completion.choices[0]?.message?.content?.trim() ?? "Sem resposta.";
  const trimmed = answer.length > 4000 ? answer.slice(0, 3997) + "..." : answer;

  const embed = new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle("Resultado da pesquisa")
    .setDescription(trimmed)
    .addFields({ name: "Pergunta", value: query.slice(0, 1024) })
    .setFooter({ text: "GPT-4o (OpenAI)" })
    .setTimestamp();

  await i.editReply({ embeds: [embed] });
}
