# botcha

Reasoning verification CLI for AI agents. Wraps the two API endpoints (`/v1/challenge` and `/v1/verify`) so agents can use them as tools.

You need a public key (`pk_live_xxx`) from the platform you're integrating with.

## Install

```bash
npm install -g @botcha/cli
```

## Commands

### `solve` — one-shot challenge + verify

```bash
echo "your response" | botcha solve --key pk_live_xxx
```

1. Gets a challenge (stderr: challenge JSON)
2. Reads your response from stdin
3. Submits for verification (stdout: result JSON)
4. Exit 0 if verified, exit 1 if failed

### `challenge` — get a challenge

```bash
botcha challenge --key pk_live_xxx
```

Prints challenge JSON to stdout:
```json
{"challengeId":"...","prompt":"Argue FOR...","expiresAt":1234567890}
```

### `verify` — submit a response

```bash
botcha verify --id <challengeId> --response "your response text"
```

Or pipe from stdin:
```bash
echo "your response" | botcha verify --id <challengeId>
```

Prints result JSON to stdout:
```json
{"verified":true,"checks":{...},"responseTime":4523,"receipt":"eyJ..."}
```

## I/O Convention

All output is JSON. Designed for agents to parse.

- **stdout**: result data (JSON)
- **stderr**: challenge prompt (in `solve` mode), errors
- **exit code**: 0 = verified, 1 = failed

## License

MIT
