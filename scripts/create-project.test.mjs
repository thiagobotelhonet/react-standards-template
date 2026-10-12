import assert from "node:assert/strict"
import { execFile } from "node:child_process"
import { mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { test } from "node:test"
import { fileURLToPath } from "node:url"
import { promisify } from "node:util"

const run = promisify(execFile)
const script = fileURLToPath(new URL("./create-project.mjs", import.meta.url))

test("gera uma cópia independente, personaliza identidade e preserva destinos existentes", async () => {
  const temporary = await mkdtemp(join(tmpdir(), "react-template-test-"))
  try {
    const destination = join(temporary, "my-app")
    await run(process.execPath, [
      script,
      destination,
      "--name",
      "my-app",
      "--title",
      "Meu & Novo App",
      "--no-install",
      "--no-git",
    ])
    const pkg = JSON.parse(
      await readFile(join(destination, "package.json"), "utf8")
    )
    assert.equal(pkg.name, "my-app")
    assert.equal(
      await readFile(join(destination, ".mcp.json"), "utf8"),
      await readFile(new URL("../.mcp.json", import.meta.url), "utf8")
    )
    assert.match(
      await readFile(join(destination, "src/config/app.ts"), "utf8"),
      /storageKey: "my-app"/
    )
    assert.match(
      await readFile(join(destination, "index.html"), "utf8"),
      /<title>Meu &amp; Novo App<\/title>/
    )
    for (const rules of [
      "CLAUDE.md",
      "docs/standards.md",
      "docs/decisions/0001-react-vite-tanstack-router.md",
      ".claude/skills/app-review-standards/SKILL.md",
      "biome-plugins/no-native-elements.grit",
    ])
      assert.equal(
        await readFile(join(destination, rules), "utf8"),
        await readFile(new URL(`../${rules}`, import.meta.url), "utf8")
      )
    const entries = await readdir(destination)
    for (const excluded of [
      ".git",
      "node_modules",
      "dist",
      ".env",
      "test-results",
    ])
      assert.equal(entries.includes(excluded), false)
    await writeFile(join(destination, "sentinel.txt"), "preserve me")
    await assert.rejects(
      run(process.execPath, [script, destination, "--no-install", "--no-git"])
    )
    assert.equal(
      await readFile(join(destination, "sentinel.txt"), "utf8"),
      "preserve me"
    )
  } finally {
    await rm(temporary, { recursive: true, force: true })
  }
})

test("inicia o git com um primeiro commit", async () => {
  const temporary = await mkdtemp(join(tmpdir(), "react-template-git-"))
  try {
    const destination = join(temporary, "com-git")
    await run(process.execPath, [script, destination, "--no-install"], {
      env: {
        ...process.env,
        GIT_AUTHOR_NAME: "Template",
        GIT_AUTHOR_EMAIL: "template@example.com",
        GIT_COMMITTER_NAME: "Template",
        GIT_COMMITTER_EMAIL: "template@example.com",
      },
    })
    const { stdout } = await run("git", ["log", "--oneline"], {
      cwd: destination,
    })
    assert.equal(stdout.trim().split("\n").length, 1)
    const { stdout: tracked } = await run(
      "git",
      ["ls-files", "CLAUDE.md", ".claude/skills/app-review-standards/SKILL.md"],
      { cwd: destination }
    )
    assert.equal(tracked.trim().split("\n").length, 2)
  } finally {
    // Logo depois do commit o git ainda pode estar escrevendo em
    // `.git/objects`, e o `rm` do Node só repete em ENOTEMPTY no Windows.
    // Sem repetição aqui, a limpeza derruba um teste que passou.
    await rm(temporary, {
      recursive: true,
      force: true,
      maxRetries: 5,
      retryDelay: 100,
    })
  }
})

test("recusa destinos dentro do próprio template", async () => {
  const destination = fileURLToPath(
    new URL("../nested-example", import.meta.url)
  )
  await assert.rejects(
    run(process.execPath, [script, destination]),
    /fora da pasta do template/
  )
})
