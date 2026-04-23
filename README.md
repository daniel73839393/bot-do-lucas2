# Discord Bot — Node.js puro

Bot Discord com geração de imagem (OpenAI, Gemini, Grok), pesquisa e embeds personalizados. **Tudo em JavaScript, sem TypeScript, sem monorepo.** Pronto para rodar em qualquer lugar (sua máquina, Railway, Render, VPS, etc.).

## Estrutura

```
bot-js/
  package.json
  index.js              ← código do bot e todos os comandos
  register-commands.js  ← registra os comandos slash no Discord
  .env.example          ← copie para .env e preencha
  .gitignore
  README.md
```

## Comandos do bot

- `/imagine prompt:[texto] size:[opcional]` — imagem via OpenAI gpt-image-1
- `/imagine-gemini prompt:[texto] hq:[true/false]` — imagem via Gemini (nano banana / nano banana pro)
- `/imagine-grok prompt:[texto]` — imagem via Grok (precisa de chave própria)
- `/search query:[pergunta]` — pesquisa via GPT-4o, resposta em embed
- `/embed titulo descricao [cor] [imagem] [thumbnail] [rodape] [url]` — embed manual
- `/embedai tema:[assunto]` — IA gera embed completo a partir de um tema

## Como rodar

### 1. Instale Node.js 20 ou superior

Baixe em https://nodejs.org se ainda não tiver.

### 2. Instale as dependências

Abra o terminal **dentro da pasta `bot-js`** e rode:

```bash
npm install
```

### 3. Configure as chaves

Copie `.env.example` para `.env`:

```bash
cp .env.example .env
```

Abra o `.env` e preencha:

| Variável | Onde pegar |
|---|---|
| `DISCORD_BOT_TOKEN` | discord.com/developers/applications → seu app → Bot → Reset Token |
| `DISCORD_CLIENT_ID` | mesma página → General Information → Application ID |
| `OPENAI_API_KEY` | https://platform.openai.com/api-keys (pago) |
| `GEMINI_API_KEY` | https://aistudio.google.com/apikey (free tier generoso) |
| `GROK_API_KEY` | https://console.x.ai (opcional) |

### 4. Registre os comandos slash (uma vez só)

```bash
npm run register
```

### 5. Rode o bot

```bash
npm start
```

Você deve ver: `Bot online como SEUBOT#1234`

### 6. Convide o bot pro seu servidor

discord.com/developers/applications → seu app → **OAuth2 → URL Generator**

- Scopes: `bot`, `applications.commands`
- Bot permissions: `Send Messages`, `Embed Links`, `Attach Files`, `Use Slash Commands`

Abra a URL gerada e escolha o servidor.

## Deploy no Railway

1. Suba **só esta pasta `bot-js`** para um repositório novo no GitHub
2. railway.app → **New Project** → **Deploy from GitHub repo**
3. Na aba **Variables**, cole as mesmas variáveis do `.env`
4. Aba **Settings** → confirme:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Railway dá deploy automático. Veja os logs: `Bot online como ...`

Pronto. Sem Docker, sem complicação.
