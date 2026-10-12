import { QueryClientProvider } from "@tanstack/react-query"
import { RouterProvider } from "@tanstack/react-router"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { appConfig } from "./config/app"
import { queryClient, router } from "./router"
import {
  initializeTheme,
  ThemeProvider,
} from "./shared/components/theme-provider"
import "./styles.css"

async function start() {
  initializeTheme()
  document.title = appConfig.name
  document.documentElement.lang = appConfig.locale
  if (import.meta.env.DEV && import.meta.env.MODE === "mock") {
    const { worker, onUnhandledFrame } = await import("./mocks/browser")
    await worker.start({ onUnhandledFrame, quiet: true })
  }
  const root = document.getElementById("root")
  if (!root) throw new Error("Root element is missing")
  createRoot(root).render(
    <StrictMode>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ThemeProvider>
    </StrictMode>
  )
}

start().catch(() => {
  const root = document.getElementById("root")
  if (root)
    root.textContent =
      "Não foi possível iniciar a aplicação. Recarregue a página."
})
