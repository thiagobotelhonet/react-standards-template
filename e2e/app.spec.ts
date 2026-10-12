import { expect, test } from "@playwright/test"

test("sessão, CRUD, busca e logout", async ({ page }) => {
  await page.goto("/items")
  await expect(page).toHaveURL(/\/login$/)
  await page.getByRole("button", { name: "Entrar", exact: true }).click()
  await expect(page.getByRole("heading", { name: "Olá, Alex." })).toBeVisible()
  await page.goto("/login")
  await expect(page.getByRole("heading", { name: "Olá, Alex." })).toBeVisible()
  await page.getByRole("link", { name: "Novo item", exact: true }).click()
  await page
    .getByLabel("Nome", { exact: true })
    .fill("Registro de ponta a ponta")
  await page.getByLabel("Descrição").fill("Criado pelo teste de jornada.")
  await page.getByRole("button", { name: "Salvar item" }).click()
  await page.getByLabel("Buscar itens").fill("Registro de ponta a ponta")
  await expect(page).toHaveURL(/q=Registro/)
  await page
    .getByRole("link", { name: "Registro de ponta a ponta", exact: true })
    .click()
  await page.getByLabel("Situação").click()
  await page.getByRole("option", { name: "Arquivado" }).click()
  await page.getByRole("button", { name: "Salvar item" }).click()
  await page.getByLabel("Buscar itens").fill("Registro de ponta a ponta")
  await expect(page).toHaveURL(/q=Registro/)
  const savedItem = page.getByRole("link", {
    name: "Registro de ponta a ponta",
    exact: true,
  })
  await expect(page.getByRole("row").filter({ has: savedItem })).toContainText(
    "Arquivado"
  )
  await page.reload()
  await page
    .getByRole("link", { name: "Registro de ponta a ponta", exact: true })
    .click()
  await page.getByRole("button", { name: "Excluir item", exact: true }).click()
  await page.getByRole("button", { name: "Confirmar exclusão" }).click()
  await page.getByLabel("Buscar itens").fill("Registro de ponta a ponta")
  await expect(page.getByText("Nenhum item encontrado.")).toBeVisible()
  await page.getByRole("button", { name: "Sair", exact: true }).click()
  await expect(page).toHaveURL(/\/login$/)
  await page.goto("/items")
  await expect(page).toHaveURL(/\/login$/)
})

test("navegação móvel, tema e paginação", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/login")
  await page.getByRole("button", { name: "Entrar", exact: true }).click()
  await page.getByRole("button", { name: "Abrir navegação" }).click()
  await page
    .getByRole("navigation", { name: "Principal" })
    .filter({ visible: true })
    .getByRole("link", { name: "Itens", exact: true })
    .click()
  await expect(
    page.getByRole("heading", { name: "Itens", exact: true })
  ).toBeVisible()
  await page.getByRole("button", { name: "Ir para a próxima página" }).click()
  await expect(page).toHaveURL(/pagina=2/)
  await expect(page.getByText("Página 2 de 2", { exact: true })).toBeVisible()
  await page.goBack()
  await expect(page.getByText("Página 1 de 2", { exact: true })).toBeVisible()
  await page.getByRole("button", { name: "Nome", exact: true }).click()
  await expect(page).toHaveURL(/ordenarPor=name/)
  await page.getByRole("button", { name: /Mudar para claro/ }).click()
  await page.getByRole("button", { name: /Mudar para escuro/ }).click()
  await expect(page.locator("html")).toHaveClass(/dark/)
  await page.reload()
  await expect(page.locator("html")).toHaveClass(/dark/)
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth
    )
  ).toBe(true)
})

test("credenciais inválidas mantêm o usuário fora da área privada", async ({
  page,
}) => {
  await page.goto("/login")
  await page.getByLabel("Senha", { exact: true }).fill("senha-incorreta")
  await page.getByRole("button", { name: "Entrar", exact: true }).click()
  await expect(page.getByRole("alert")).toHaveText("E-mail ou senha inválidos.")
  await expect(page).toHaveURL(/\/login$/)
  await page.goto("/items/new")
  await expect(page).toHaveURL(/\/login$/)
})
