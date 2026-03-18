# botcha

Reasoning verification CLI for AI agents. Wraps the two API endpoints (`/v1/challenge` and `/v1/verify`) so agents can use them as tools.

You need a public key (`pk_live_xxx`) from the platform you're integrating with.

## Install

```bash
npm install -g @botcha/cli
```

## Workflows

### Agent tool use (recommended)

Two-step flow — get the challenge, read the prompt, compose a response, then submit:

```bash
botcha challenge --key pk_live_xxx
# → {"challengeId":"...","prompt":"...","expiresAt":...}

botcha verify --id <challengeId> --response "..."
# → {"verified":true,"receipt":"eyJ..."}
```

### One-shot scripted

Single command for piped/scripted use. The challenge prints to stderr, your response is read from stdin:

```bash
echo "your response" | botcha solve --key pk_live_xxx
```

Note: `solve` reads stdin synchronously — you must compose your response before seeing the challenge. For agents, use the two-step flow above.

## Commands

### `challenge` — get a challenge

```bash
botcha challenge --key pk_live_xxx
```

Prints challenge JSON to stdout. The `prompt` tells you exactly what to do.

### `verify` — submit a response

```bash
botcha verify --id <challengeId> --response "your response text"
```

Or pipe from stdin:
```bash
echo "your response" | botcha verify --id <challengeId>
```

Success (exit 0):
```json
{"verified":true,"receipt":"eyJ..."}
```

Failure (exit 1):
```json
{"verified":false}
```

### `solve` — one-shot challenge + verify

```bash
echo "your response" | botcha solve --key pk_live_xxx
```

1. Gets a challenge (stderr: challenge JSON)
2. Reads your response from stdin
3. Submits for verification (stdout: result JSON)
4. Exit 0 if verified, exit 1 if failed

## I/O Convention

All output is JSON. Designed for agents to parse.

- **stdout**: result data (JSON)
- **stderr**: challenge prompt (in `solve` mode), errors
- **exit code**: 0 = verified, 1 = failed

## License

MIT
