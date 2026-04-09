<p align="center">
  <img src="./assets/banner.png" alt="FakeSocial Banner" />
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/fakesocial-typescript-sdk">
    <img src="https://img.shields.io/npm/v/fakesocial-typescript-sdk?color=blue&label=npm" />
  </a>
  <a href="https://www.npmjs.com/package/fakesocial-typescript-sdk">
    <img src="https://img.shields.io/npm/dw/fakesocial-typescript-sdk?color=green&label=downloads" />
  </a>
  <img src="https://img.shields.io/github/license/FakeSocial/fakesocial-typescript-sdk" />
  <img src="https://img.shields.io/github/stars/FakeSocial/fakesocial-typescript-sdk?style=social" />
</p>

<h1 align="center">FakeSocial TypeScript SDK</h1>

<p align="center">
  Official SDK for interact with the FakeSocial API
</p>

## Installation

```bash
npm install fakesocial-typescript-sdk

bun add fakesocial-typescript-sdk
```

## Vérification

```bash
bun run check
```

## Utilisation

```ts
import { createFakeMediaClient } from "fakesocial-ts";

const client = createFakeMediaClient({
  baseUrl: "https://fakesocial.fr",
  token: "user-or-access-token",
});

const me = await client.me.get();
const posts = await client.posts.list({ limit: 20 });
```

## Instantiating a Fake Bot

The SDK can also be used to instantiate a simple FakeMedia bot that acts as a user session and listens for new posts.

```ts
import { createFakeMediaClient } from "fakesocial-ts";

const bot = createFakeMediaClient({
  baseUrl: "https://fakesocial.fr",
  token: "fake-bot-token",
});

const watcher = bot.posts.watch({
  intervalMs: 10000,
  initialFetch: true,
});

watcher.on("new-posts", (posts) => {
  console.log("Fake bot received new posts:", posts);
});

watcher.start();

// Optionally post as the bot
await bot.posts.create({ content: "Hello from FakeBot!" });
```

The bot can also change session token at runtime using `bot.setToken("new-token")` or create a new client with `bot.withToken("other-token")`.

## Points d'entrée

- `auth` pour login, inscription, TOTP et passkeys
- `oauth` pour token, revocation, applications et helpers d’URL
- `users`, `me`, `posts`, `conversations`, `notifications`
- `reports`, `appeals`, `admin`, `platform`

La bibliothèque expose aussi `FakeMediaApiError` pour normaliser les erreurs HTTP côté client.

## Architecture

Le SDK est découpé en couches simples:

- `src/core/` pour le transport HTTP et les helpers partagés
- `src/modules/` pour les groupes d’endpoints par domaine métier
- `src/client.ts` pour l’assemblage de la façade publique

Cette séparation permet d’ajouter des endpoints sans regonfler un fichier central unique.
