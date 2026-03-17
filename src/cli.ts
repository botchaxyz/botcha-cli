#!/usr/bin/env node

import { Crust } from "@crustjs/core";
import { helpPlugin, versionPlugin } from "@crustjs/plugins";

const API_BASE = process.env.BOTCHA_API_URL || "https://api.botcha.xyz";

// ── HTTP ──

async function post<T>(
  path: string,
  body: Record<string, unknown>,
  headers?: Record<string, string>
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = (await res.json().catch(() => ({ error: "UNKNOWN" }))) as { error: string };
    throw new Error(`${res.status}: ${err.error}`);
  }

  return res.json() as Promise<T>;
}

// ── stdin ──

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf-8").trim();
}

// ── CLI ──

const cli = new Crust("botcha")
  .meta({ description: "Reasoning verification for AI agents" })
  .use(versionPlugin("0.2.0"))
  .use(helpPlugin())
  .command("solve", (cmd) =>
    cmd
      .meta({ description: "One-shot: challenge → stdin response → verify" })
      .flags({
        key: {
          type: "string",
          description: "Public key (pk_live_xxx)",
          short: "k",
          required: true,
        },
      })
      .run(async ({ flags }) => {
        const challenge = await post<{
          challengeId: string;
          prompt: string;
          expiresAt: number;
        }>("/v1/challenge", {}, { "X-Botcha-Key": flags.key });

        process.stderr.write(JSON.stringify(challenge) + "\n");

        const response = await readStdin();
        if (!response) {
          console.error("Error: empty response on stdin");
          process.exit(1);
        }

        const result = await post("/v1/verify", {
          challengeId: challenge.challengeId,
          response,
        });
        console.log(JSON.stringify(result));
        if (!(result as { verified: boolean }).verified) process.exit(1);
      })
  )
  .command("challenge", (cmd) =>
    cmd
      .meta({ description: "Get a challenge (stdout: JSON)" })
      .flags({
        key: {
          type: "string",
          description: "Public key (pk_live_xxx)",
          short: "k",
          required: true,
        },
      })
      .run(async ({ flags }) => {
        const result = await post("/v1/challenge", {}, { "X-Botcha-Key": flags.key });
        console.log(JSON.stringify(result));
      })
  )
  .command("verify", (cmd) =>
    cmd
      .meta({ description: "Submit a response (stdout: JSON, exit 1 if failed)" })
      .flags({
        id: {
          type: "string",
          description: "Challenge ID",
          required: true,
        },
        response: {
          type: "string",
          description: "Response text (or pipe via stdin)",
          short: "r",
        },
      })
      .run(async ({ flags }) => {
        const response = flags.response || (await readStdin());
        if (!response) {
          console.error("Error: --response or stdin is required");
          process.exit(1);
        }

        const result = await post("/v1/verify", {
          challengeId: flags.id,
          response,
        });
        console.log(JSON.stringify(result));
        if (!(result as { verified: boolean }).verified) process.exit(1);
      })
  );

await cli.execute();
