import { HttpResponse, http } from "msw"
import { setupServer } from "msw/node"
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "vitest"
import { fetchSession, login, logout } from "@/features/auth"
import { handlers, resetMockState } from "@/mocks/handlers"
import { apiBaseUrl, setCsrfToken } from "@/shared/api/client"
import {
  deleteItem,
  fetchItem,
  fetchItems,
  saveItem,
} from "../api/items.services"
import { itemsFiltersSchema } from "../types/items.schemas"

const server = setupServer(...handlers)
beforeAll(() => server.listen({ onUnhandledRequest: "error" }))
beforeEach(() => {
  resetMockState()
  setCsrfToken(null)
})
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
const filters = itemsFiltersSchema.parse({})
async function signIn() {
  await fetchSession()
  await login({ email: "demo@example.com", password: "demo12345" })
}

describe("sessão e cadastro integrado", () => {
  it("bloqueia dados privados antes do login e após logout", async () => {
    expect(await fetchSession()).toBeNull()
    await expect(fetchItems(filters)).rejects.toMatchObject({
      response: { status: 401 },
    })
    await signIn()
    expect((await fetchItems(filters)).total).toBe(18)
    await logout()
    await expect(fetchItems(filters)).rejects.toMatchObject({
      response: { status: 401 },
    })
  })
  it("cria, pesquisa, edita e exclui o mesmo registro", async () => {
    await signIn()
    const created = await saveItem({
      input: {
        name: "Novo registro",
        description: "Descrição",
        status: "active",
      },
    })
    const found = await fetchItems({ ...filters, q: "Novo registro" })
    expect(found.items.map((item) => item.id)).toEqual([created.id])
    await saveItem({
      id: created.id,
      input: { name: "Registro revisado", description: "", status: "archived" },
    })
    expect(await fetchItem(created.id)).toMatchObject({
      name: "Registro revisado",
      status: "archived",
    })
    await deleteItem(created.id)
    await expect(fetchItem(created.id)).rejects.toMatchObject({
      response: { status: 404 },
    })
  })
  it("pagina no servidor sem repetir registros", async () => {
    await signIn()
    const first = await fetchItems(filters)
    const second = await fetchItems({ ...filters, pagina: 2 })
    expect(first.items).toHaveLength(10)
    expect(second.items).toHaveLength(8)
    expect(
      new Set([...first.items, ...second.items].map((item) => item.id)).size
    ).toBe(18)
  })
  it("recusa escrita sem token CSRF", async () => {
    await signIn()
    setCsrfToken(null)
    await expect(
      saveItem({ input: { name: "Teste", description: "", status: "active" } })
    ).rejects.toMatchObject({ response: { status: 403 } })
  })
  it("recusa uma resposta que viola o contrato", async () => {
    await signIn()
    server.use(
      http.get(new URL("items", apiBaseUrl).href, () =>
        HttpResponse.json({ items: [{ id: 1 }], total: 1 })
      )
    )
    await expect(fetchItems(filters)).rejects.toThrow()
  })
})
