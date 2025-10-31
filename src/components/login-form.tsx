import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom"
import { url } from "@/url"
import { useUser } from "@/use.store"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function LoginForm({ className, ...props }: React.ComponentProps<"form">) {
  const navigate = useNavigate()
  const setToken = useUser((s) => s.setToken)
  const setUser = useUser((s) => s.setUser)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  const queryClient = useQueryClient()

  async function loginFn({ email, password }: { email: string; password: string }) {
    const res = await fetch(`${url}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const body = await res.json()

    if (!res.ok) {
      throw new Error(body?.message || body?.error || "Credenciais inválidas")
    }

    return body
  }

  const mutation = useMutation({
    mutationFn: loginFn,
    onSuccess(data) {
      // Esperamos { token, user }
      const token: string | undefined = data?.token ?? data?.accessToken ?? data?.access_token
      const user = data?.user ?? null

      if (!token) {
        setError("Resposta inválida do servidor: token ausente.")
        return
      }

      setToken(token)
      setUser(user)

      // Invalidate queries that may depend on auth
      queryClient.invalidateQueries()

      navigate("/home")
    },
    onError(err: any) {
      setError(err?.message || "Erro de conexão. Tente novamente.")
    },
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError("Preencha e-mail e senha.")
      return
    }

    mutation.mutate({ email, password })
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
  aria-busy={mutation.status === "pending"}
      {...props}
    >
  <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Bem-Vindo</h1>
          <h1 className="text-2xl font-bold">Entre com sua conta</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Digite seu e-mail abaixo para fazer login em sua conta
          </p>
        </div>

        {error && (
          <div className="text-sm text-destructive text-center" role="alert">
            {error}
          </div>
        )}

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="seuemail@exemplo.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>

        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Senha</FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Esqueceu a senha?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>

        <Field>
          <Button type="submit" disabled={mutation.status === "pending"}>
            {mutation.status === "pending" ? "Entrando..." : "Login"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
