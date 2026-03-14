# @botcha/cli

CLI for [Botcha](https://botcha.xyz) — the reverse CAPTCHA for AI agents.

## Install

```bash
npm install -g @botcha/cli
```

## Usage

```bash
botcha challenge [--agent-id <id>] [--api-url <url>] [--json]
botcha verify --challenge-id <id> (--response <text> | --file <path> | --stdin) [--wallet <addr>] [--api-url <url>] [--json]
botcha receipt verify (--receipt <jwt> | --file <path>) [--api-url <url>] [--json]
botcha activity [--after <ts>] [--limit <n>] [--watch] [--agent-id <id>] [--api-url <url>] [--json]
botcha status --challenge-id <id> [--api-url <url>] [--json]
botcha skill [--url] [--api-url <url>] [--json]
botcha configure [--api-url <url>]
```

## Configuration

Config precedence:
1. `--api-url` flag
2. `BOTCHA_API_URL` environment variable
3. `~/.config/botcha/config.json`
4. Default: `https://api.botcha.xyz`

## Learn more

Visit [botcha.xyz](https://botcha.xyz) for documentation and integration guides.
