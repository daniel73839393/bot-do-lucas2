import "dotenv/config";
import {
  REST,
  Routes,
  SlashCommandBuilder,
  ApplicationCommandOptionType,
} from "discord.js";

const token = process.env.DISCORD_BOT_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
const guildId = process.env.DISCORD_GUILD_ID;

if (!token || !clientId) {
  console.error(
    "Erro: defina DISCORD_BOT_TOKEN e DISCORD_CLIENT_ID no .env antes de registrar.",
  );
  process.exit(1);
}

const commands = [
  new SlashCommandBuilder()
    .setName("imagine")
    .setDescription("Gera imagem com OpenAI (gpt-image-1).")
    .addStringOption((o) =>
      o.setName("prompt").setDescription("Descrição da imagem").setRequired(true),
    )
    .addStringOption((o) =>
      o
        .setName("size")
        .setDescription("Tamanho")
        .addChoices(
          { name: "1024x1024", value: "1024x1024" },
          { name: "1024x1536 (retrato)", value: "1024x1536" },
          { name: "1536x1024 (paisagem)", value: "1536x1024" },
        ),
    ),
  new SlashCommandBuilder()
    .setName("imagine-gemini")
    .setDescription("Gera imagem com Google Gemini.")
    .addStringOption((o) =>
      o.setName("prompt").setDescription("Descrição da imagem").setRequired(true),
    )
    .addBooleanOption((o) =>
      o.setName("hq").setDescription("Usar modelo Pro de maior qualidade"),
    ),
  new SlashCommandBuilder()
    .setName("imagine-grok")
    .setDescription("Gera imagem com Grok (xAI).")
    .addStringOption((o) =>
      o.setName("prompt").setDescription("Descrição da imagem").setRequired(true),
    ),
  new SlashCommandBuilder()
    .setName("search")
    .setDescription("Pesquisa com IA (GPT-4o) e responde em embed.")
    .addStringOption((o) =>
      o.setName("query").setDescription("O que pesquisar").setRequired(true),
    ),
  new SlashCommandBuilder()
    .setName("embed")
    .setDescription("Cria um embed customizado.")
    .addStringOption((o) =>
      o.setName("titulo").setDescription("Título do embed").setRequired(true),
    )
    .addStringOption((o) =>
      o
        .setName("descricao")
        .setDescription("Descrição do embed")
        .setRequired(true),
    )
    .addStringOption((o) =>
      o.setName("cor").setDescription("Cor em hex (ex: FF5733 ou #FF5733)"),
    )
    .addStringOption((o) =>
      o.setName("imagem").setDescription("URL da imagem grande"),
    )
    .addStringOption((o) =>
      o.setName("thumbnail").setDescription("URL da thumbnail (canto)"),
    )
    .addStringOption((o) =>
      o.setName("rodape").setDescription("Texto do rodapé"),
    )
    .addStringOption((o) =>
      o.setName("url").setDescription("URL clicável no título"),
    ),
  new SlashCommandBuilder()
    .setName("embedai")
    .setDescription("IA gera um embed completo a partir de um tema.")
    .addStringOption((o) =>
      o.setName("tema").setDescription("Tema/assunto do embed").setRequired(true),
    ),
].map((c) => c.toJSON());

const rest = new REST({ version: "10" }).setToken(token);

(async () => {
  try {
    if (guildId) {
      console.log(`Registrando comandos no guild ${guildId}...`);
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: commands,
      });
    } else {
      console.log("Registrando comandos globalmente (pode levar até 1h)...");
      await rest.put(Routes.applicationCommands(clientId), { body: commands });
    }
    console.log(`OK! ${commands.length} comandos registrados.`);
  } catch (err) {
    console.error("Falha ao registrar:", err);
    process.exit(1);
  }
})();
