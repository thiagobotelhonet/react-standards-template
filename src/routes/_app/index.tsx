import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { ArrowRightIcon, ListChecksIcon, PlusIcon } from "lucide-react"
import { itemsFiltersSchema, itemsQueryOptions } from "@/features/items"
import { RequestError } from "@/shared/components/request-error"
import { buttonVariants } from "@/shared/components/ui/button"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { formatNumber } from "@/shared/lib/format"

const recentItems = itemsFiltersSchema.parse({ porPagina: 5 })
const recentRowIds = Array.from(
  { length: recentItems.porPagina },
  (_, index) => `item-${index}`
)

export const Route = createFileRoute("/_app/")({
  loader: ({ context }) => {
    void context.queryClient.prefetchQuery(itemsQueryOptions(recentItems))
  },
  component: Home,
})

function Home() {
  const { user } = Route.useRouteContext()
  const items = useQuery(itemsQueryOptions(recentItems))
  return (
    <div className="space-y-8">
      <div>
        <p className="mb-2 text-sm text-muted-foreground">
          Seu espaço, organizado.
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Olá, {user.name.split(" ")[0]}.
        </h1>
        <p className="mt-3 text-muted-foreground">
          Acompanhe seus registros e continue de onde parou.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-medium text-sm text-muted-foreground">
              Itens cadastrados
            </h2>
            <ListChecksIcon className="size-5 text-primary" />
          </div>
          {items.isPending ? (
            <div aria-busy="true" className="mt-5 py-1">
              <span className="sr-only">Carregando…</span>
              <Skeleton className="h-8 w-16" />
            </div>
          ) : (
            <p className="mt-5 text-4xl font-semibold tracking-tight">
              {items.data ? formatNumber(items.data.total) : "—"}
            </p>
          )}
          <p className="mt-2 text-sm text-muted-foreground">
            Total no seu espaço de trabalho
          </p>
        </section>
        <section className="rounded-2xl border bg-card p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold">Tudo começa com um registro</h2>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
            Mantenha as informações atualizadas e encontre o que precisa com uma
            busca.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/items/new" className={buttonVariants()}>
              <PlusIcon />
              Novo item
            </Link>
            <Link
              to="/items"
              className={buttonVariants({ variant: "outline" })}
            >
              Ver todos
              <ArrowRightIcon />
            </Link>
          </div>
        </section>
      </div>
      <section className="overflow-hidden rounded-2xl border bg-card">
        <div className="border-b p-6">
          <h2 className="font-semibold">Seus itens</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Uma visão rápida dos primeiros registros por nome.
          </p>
        </div>
        {items.error ? (
          <div className="p-6">
            <RequestError
              error={items.error}
              onRetry={() => void items.refetch()}
            />
          </div>
        ) : items.isPending ? (
          <div aria-busy="true">
            <span className="sr-only">Carregando…</span>
            <ul className="divide-y">
              {recentRowIds.map((id) => (
                <li key={id} className="px-6 py-4">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="mt-2 h-4 w-72 max-w-full" />
                </li>
              ))}
            </ul>
          </div>
        ) : items.data.items.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">
            Nenhum item cadastrado.
          </p>
        ) : (
          <ul className="divide-y">
            {items.data.items.map((item) => (
              <li key={item.id}>
                <Link
                  to="/items/$itemId/edit"
                  params={{ itemId: item.id }}
                  className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-muted/50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{item.name}</p>
                    <p className="mt-1 truncate text-sm text-muted-foreground">
                      {item.description || "Sem descrição"}
                    </p>
                  </div>
                  <ArrowRightIcon className="size-4 shrink-0 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
