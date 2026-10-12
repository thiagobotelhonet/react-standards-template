import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import {
  ItemForm,
  itemQueryOptions,
  useDeleteItem,
  useSaveItem,
} from "@/features/items"
import { RequestError } from "@/shared/components/request-error"
import { Button } from "@/shared/components/ui/button"

export const Route = createFileRoute("/_app/items/$itemId/edit")({
  loader: ({ context, params }) => {
    void context.queryClient.prefetchQuery(itemQueryOptions(params.itemId))
  },
  component: EditItem,
})
function EditItem() {
  const { itemId } = Route.useParams()
  const navigate = Route.useNavigate()
  const item = useQuery(itemQueryOptions(itemId))
  const save = useSaveItem()
  const remove = useDeleteItem()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const goBack = () => {
    void navigate({ to: "/items" })
  }
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Editar item</h1>
        <p className="mt-2 text-muted-foreground">
          Atualize as informações do registro.
        </p>
      </div>
      {item.isPending && <p role="status">Carregando item…</p>}
      {item.error && (
        <RequestError error={item.error} onRetry={() => void item.refetch()} />
      )}
      {item.data && (
        <>
          <ItemForm
            key={item.data.id}
            initialValues={item.data}
            isPending={save.isPending || remove.isPending}
            error={save.error}
            onSave={(input) =>
              save.mutate({ id: itemId, input }, { onSuccess: goBack })
            }
          />
          <section className="rounded-2xl border p-6">
            <h2 className="font-medium">Excluir registro</h2>
            <p className="mt-2 mb-4 text-sm text-muted-foreground">
              A exclusão é permanente. Confira o item antes de continuar.
            </p>
            {remove.error && <RequestError error={remove.error} />}
            {confirmDelete ? (
              <div className="space-y-3">
                <p role="alert" className="text-sm">
                  Excluir “{item.data.name}”?
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    disabled={remove.isPending}
                    onClick={() => setConfirmDelete(false)}
                  >
                    Manter item
                  </Button>
                  <Button
                    variant="destructive"
                    disabled={remove.isPending || save.isPending}
                    onClick={() => remove.mutate(itemId, { onSuccess: goBack })}
                  >
                    Confirmar exclusão
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="destructive"
                disabled={save.isPending}
                onClick={() => setConfirmDelete(true)}
              >
                Excluir item
              </Button>
            )}
          </section>
        </>
      )}
    </div>
  )
}
