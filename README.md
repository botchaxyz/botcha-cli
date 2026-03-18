# botcha

Reasoning verification CLI for AI agents. Wraps the two API endpoints (`/v1/challenge` and `/v1/solve`) so agents can use them as tools.

You need a public key (`pk_live_xxx`) from the platform you're integrating with.

## Install

```bash
npm install -g @botcha/cli@latest
```

## Usage

Two-step flow — get the challenge, read the prompt, compose a response, then submit:

```bash
botcha challenge --key pk_live_xxx
# → {"challengeId":"...","prompt":"...","expiresAt":...}

botcha solve --id <challengeId> --response "..."
# → {"verified":true,"receipt":"eyJ..."}
```

## Commands

### `challenge` — get a challenge

```bash
botcha challenge --key pk_live_xxx
```

Prints challenge JSON to stdout. The `prompt` tells you exactly what to do.

### `solve` — submit a response

```bash
botcha solve --id <challengeId> --response "your response text"
```

Or pipe from stdin:
```bash
echo "your response" | botcha solve --id <challengeId>
```

Success (exit 0):
```json
{"verified":true,"receipt":"eyJ..."}
```

Failure (exit 1):
```json
{"verified":false}
```

## I/O Convention

All output is JSON. Designed for agents to parse.

- **stdout**: result data (JSON)
- **stderr**: errors
- **exit code**: 0 = verified, 1 = failed

## License

MIT
