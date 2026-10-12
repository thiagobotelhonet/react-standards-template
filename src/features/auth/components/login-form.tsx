import { useForm } from "@tanstack/react-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"
import { isDemo } from "@/config/app"
import { RequestError } from "@/shared/components/request-error"
import { Button } from "@/shared/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field"
import { Input } from "@/shared/components/ui/input"
import { login } from "../api/auth.services"
import { loginSchema } from "../types/auth.schemas"

export function LoginForm() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: login,
    onSuccess: async () => {
      await queryClient.cancelQueries()
      queryClient.clear()
      await router.invalidate()
      await router.navigate({ to: "/", replace: true })
    },
  })
  const form = useForm({
    defaultValues: {
      email: isDemo ? "demo@example.com" : "",
      password: isDemo ? "demo12345" : "",
    },
    validators: { onSubmit: loginSchema },
    onSubmit: ({ value }) => mutation.mutateAsync(value).catch(() => {}),
  })
  return (
    <form
      className="flex flex-col gap-5"
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        void form.handleSubmit()
      }}
    >
      {mutation.error && <RequestError error={mutation.error} />}
      <form.Field name="email">
        {(field) => {
          const invalid = field.state.meta.errors.length > 0
          return (
            <Field data-invalid={invalid}>
              <FieldLabel htmlFor="email">E-mail</FieldLabel>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={invalid}
                aria-describedby={invalid ? "email-error" : undefined}
              />
              <FieldError id="email-error" errors={field.state.meta.errors} />
            </Field>
          )
        }}
      </form.Field>
      <form.Field name="password">
        {(field) => {
          const invalid = field.state.meta.errors.length > 0
          return (
            <Field data-invalid={invalid}>
              <FieldLabel htmlFor="password">Senha</FieldLabel>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={invalid}
                aria-describedby={invalid ? "password-error" : undefined}
              />
              <FieldError
                id="password-error"
                errors={field.state.meta.errors}
              />
            </Field>
          )
        }}
      </form.Field>
      <Button type="submit" size="lg" disabled={mutation.isPending}>
        {mutation.isPending ? "Entrando…" : "Entrar"}
      </Button>
      {isDemo && (
        <p className="text-center text-muted-foreground text-xs">
          Ambiente de demonstração. Os dados ficam neste navegador.
        </p>
      )}
    </form>
  )
}
