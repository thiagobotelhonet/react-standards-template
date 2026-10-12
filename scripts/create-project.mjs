#!/usr/bin/env node
import { execFileSync } from "node:child_process"
import { cp, mkdir, readFile, realpath, writeFile } from "node:fs/promises"
import { basename, isAbsolute, relative, resolve, sep } from "node:path"
import { fileURLToPath } from "node:url"

const source = await realpath(fileURLToPath(new URL("..", import.meta.url)))
const usage =
  "Use: criar-app <destino> [--name nome-do-pacote] [--title 'Nome do aplicativo'] [--no-install] [--no-git]"
const args = process.argv.slice(2)
const destination = args.shift()
const options = { install: true, git: true }
while (args.length) {
  const flag = args.shift()
  if (flag === "--no-install") {
    options.install = false
    continue
  }
  if (flag === "--no-git") {
    options.git = false
    continue
  }
  const value = args.shift()
  if (!["--name", "--title"].includes(flag) || !value) throw new Error(usage)
  options[flag] = value
}
if (!destination) throw new Error("Informe uma pasta de destino nova.")
const target = resolve(destination)
const parent = await realpath(resolve(target, ".."))
const canonicalTarget = resolve(parent, basename(target))
const pathFromSource = relative(source, canonicalTarget)
if (
  !pathFromSource ||
  (!pathFromSource.startsWith(`..${sep}`) && !isAbsolute(pathFromSource))
) {
  throw new Error("Crie o projeto fora da pasta do template.")
}
const name = options["--name"] ?? basename(target)
if (!/^[a-z][a-z0-9-]{0,79}$/.test(name))
  throw new Error(
    "O nome deve usar letras minúsculas, números e hífens; começar com letra e ter até 80 caracteres."
  )
const title = options["--title"] ?? name
if (!title.trim() || title.length > 100)
  throw new Error("O título deve ter entre 1 e 100 caracteres.")

const entries = [
  "src",
  "public",
  "docs",
  "scripts",
  "e2e",
  ".claude",
  ".github",
  ".gitignore",
  ".gitattributes",
  ".env.example",
  ".env.mock",
  ".node-version",
  ".mcp.json",
  "CLAUDE.md",
  "README.md",
  "README.en.md",
  "CHANGELOG.md",
  "package.json",
  "pnpm-lock.yaml",
  "pnpm-workspace.yaml",
  "tsconfig.json",
  "biome.json",
  "biome-plugins",
  "components.json",
  "index.html",
  "vite.config.ts",
  "vitest.config.ts",
  "vitest.setup.ts",
  "playwright.config.ts",
]
await mkdir(canonicalTarget)
for (const entry of entries) {
  await mkdir(resolve(canonicalTarget, entry, ".."), { recursive: true })
  await cp(resolve(source, entry), resolve(canonicalTarget, entry), {
    recursive: true,
    errorOnExist: true,
    force: false,
  })
}
const packagePath = resolve(canonicalTarget, "package.json")
const pkg = JSON.parse(await readFile(packagePath, "utf8"))
pkg.name = name
pkg.version = "0.1.0"
await writeFile(packagePath, `${JSON.stringify(pkg, null, 2)}\n`)
const configPath = resolve(canonicalTarget, "src/config/app.ts")
const config = await readFile(configPath, "utf8")
await writeFile(
  configPath,
  config
    .replace(/name: "(?:\\.|[^"\\])*"/, () => `name: ${JSON.stringify(title)}`)
    .replace(/storageKey: "[^"]*"/, () => `storageKey: ${JSON.stringify(name)}`)
)
const htmlPath = resolve(canonicalTarget, "index.html")
const html = await readFile(htmlPath, "utf8")
const escapedTitle = title
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
await writeFile(
  htmlPath,
  html.replace(/<title>.*?<\/title>/s, () => `<title>${escapedTitle}</title>`)
)
function shellQuote(value) {
  return `'${value.replaceAll("'", "'\\''")}'`
}

const done = ["arquivos copiados", "identidade ajustada"]
const pending = []

if (options.install) {
  try {
    execFileSync("pnpm", ["install", "--frozen-lockfile"], {
      cwd: canonicalTarget,
      stdio: "inherit",
      // No Windows o `pnpm` é um `.cmd`, e o Node recusa executar `.cmd` sem
      // shell desde a correção do CVE-2024-27980. Sem isto a instalação falha
      // em silêncio lá e o projeto nasce sem `node_modules`. Os argumentos
      // são literais; nada aqui vem de quem chamou o comando.
      shell: process.platform === "win32",
    })
    done.push("dependências instaladas")
  } catch {
    pending.push("pnpm install --frozen-lockfile")
  }
} else {
  pending.push("pnpm install --frozen-lockfile")
}

if (options.git) {
  const git = (...gitArgs) =>
    execFileSync("git", gitArgs, { cwd: canonicalTarget, stdio: "pipe" })
  try {
    git("init", "-q")
    git("add", "-A")
    git("commit", "-q", "-m", "Projeto inicial a partir do react-app-template")
    done.push("git iniciado com o primeiro commit")
  } catch {
    pending.push(
      "git init && git add -A && git commit (confira git config user.email)"
    )
  }
}

const lines = [
  `Projeto criado em ${canonicalTarget}`,
  "",
  ...done.map((step) => `  ✓ ${step}`),
]
if (pending.length) {
  lines.push("", "Faltou rodar:", ...pending.map((step) => `  ${step}`))
}
lines.push(
  "",
  "Próximos passos:",
  `  cd ${shellQuote(canonicalTarget)}`,
  "  pnpm dev:mock"
)
console.log(lines.join("\n"))
