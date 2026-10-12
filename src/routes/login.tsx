import { createFileRoute, redirect } from "@tanstack/react-router"
import { ArrowUpRightIcon } from "lucide-react"
import { appConfig } from "@/config/app"
import { LoginForm, sessionQueryOptions } from "@/features/auth"

export const Route = createFileRoute("/login")({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.fetchQuery(sessionQueryOptions())
    if (user) throw redirect({ to: "/", replace: true })
  },
  component: () => (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-5 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-3 font-semibold">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <ArrowUpRightIcon />
          </span>
          {appConfig.name}
        </div>
        <section className="rounded-2xl border bg-card p-7 shadow-sm">
          <h1 className="text-2xl font-semibold tracking-tight">
            Bem-vindo de volta
          </h1>
          <p className="mt-2 mb-7 text-muted-foreground text-sm">
            Entre para acessar seu espaço de trabalho.
          </p>
          <LoginForm />
        </section>
      </div>
    </main>
  ),
})
