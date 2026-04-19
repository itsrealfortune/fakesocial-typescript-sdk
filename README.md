<p align="center">
  <img src="./assets/banner.png" alt="FakeSocial Banner" />
</p>
<p align="center">
  Official TypeScript SDK for the FakeSocial API
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/fakesocial-ts">
    <img src="https://img.shields.io/npm/v/fakesocial-ts?color=5865F2&label=npm&logo=npm" />
  </a>
  <a href="https://www.npmjs.com/package/fakesocial-ts">
    <img src="https://img.shields.io/npm/dw/fakesocial-ts?color=57F287&label=downloads&logo=npm" />
  </a>
  <a href="https://github.com/FakeSocial/fakesocial-typescript-sdk/commits/main"><img alt="Last commit." src="https://img.shields.io/github/last-commit/FakeSocial/fakesocial-typescript-sdk?logo=github&logoColor=ffffff"></a>
  <img src="https://img.shields.io/github/license/FakeSocial/fakesocial-typescript-sdk?color=ed4245&label=license" />
  <img src="https://img.shields.io/github/stars/FakeSocial/fakesocial-typescript-sdk?style=for-the-badge" />
</p>

<p align="center">
  <a href="#installation">#Installation</a> •
  <a href="#quick-example">#Quick Example</a> •
  <a href="#features">#Features</a> •
  <a href="#architecture">#Architecture</a> •
  <a href="#contributing">#Contributing</a>
</p>

## About

**FakeSocial** is a modern, lightweight and fully typed SDK designed to interact with the FakeSocial API effortlessly.

Built with performance and developer experience in mind, it provides a clean and modular interface for building apps, bots and integrations.

<p align="center">
  Special thanks to <a href="https://github.com/itsrealfortune"><b>@itsrealfortune</b></a> for being the official creator of FakeSocial SDK 💜
</p>

## Installation

```bash
npm install fakesocial-ts
bun add fakesocial-ts
```

## Quick Example

```ts
import { createFakeMediaClient } from "fakesocial-ts";

const client = createFakeMediaClient({
  baseUrl: "https://fakesocial.fr",
  token: "your-token",
});

const me = await client.me.get();
console.log(me);
```

## Bot Example

Create a simple FakeSocial bot that listens for new posts:

```ts
const bot = createFakeMediaClient({
  baseUrl: "https://fakesocial.fr",
  token: "bot-token",
});

const watcher = bot.posts.watch({
  intervalMs: 10000,
  initialFetch: true,
});

watcher.on("new-posts", (posts) => {
  console.log(posts);
});

watcher.start();
```

## Features

* Fully typed with TypeScript
* Simple and intuitive API
* Modular architecture
* Bot-ready features
* Optimized for performance

## API Modules

* `auth` – authentication (login, register, TOTP, passkeys)
* `oauth` – tokens, apps, URL helpers
* `users`, `me`, `posts`, `conversations`, `notifications`
* `reports`, `appeals`, `admin`, `platform`

Includes `FakeMediaApiError` for consistent error handling.

## Architecture

The SDK is structured into clear layers:

* `core/` → HTTP layer & shared utilities
* `modules/` → domain-specific endpoints
* `client.ts` → public API interface

This design ensures scalability and maintainability.

## Contributing

Contributions, issues and feature requests are welcome!

## License

MIT