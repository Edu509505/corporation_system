import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { url } from "@/url";
import { useUser } from "@/use.store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ImagemLogin from "../assets/img/IMG-20240823-WA0208.jpg";
import LogoHorizon from "../assets/img/logo.svg"

// ------------------------------
// Formulário de Login
// ------------------------------
function LoginForm({ className, ...props }: React.ComponentProps<"form">) {
  const navigate = useNavigate();
  const { setUser, setToken } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  async function loginFn({ email, password }: { email: string; password: string }) {
    const res = await fetch(`${url}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include", // ESSENCIAL para cookies/sessões
    });

    const body = await res.json();

    if (!res.ok) {
      throw new Error(body?.message || body?.error || "Credenciais inválidas");
    }

    return body;
  }

  const mutation = useMutation({
    mutationFn: loginFn,
    onSuccess(data) {
      const user = data?.user ?? null;
      const token = data?.token ?? null;

      if (!user) {
        setError("Resposta inválida do servidor: usuário ausente.");
        return;
      }

      // Salva no Zustand (com persistência no localStorage)
      setUser(user);
      setToken(token);

      // Invalida queries antigas do React Query (como /me)
      queryClient.invalidateQueries();

      // Redireciona
      navigate("/home");
    },
    onError(err: any) {
      setError(err?.message || "Erro de conexão. Tente novamente.");
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Preencha e-mail e senha.");
      return;
    }

    mutation.mutate({ email, password });
  }

  return (
    <form
      className={cn("flex flex-col gap-6 items-center", className)}
      onSubmit={handleSubmit}
      aria-busy={mutation.isPending}
      {...props}
    >
      <div className="flex-col lg:hidden"> <img src={LogoHorizon} className="size-20" /> </div>
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
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Entrando..." : "Login"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}

// ------------------------------
// Skeleton de carregamento
// ------------------------------
function LoginLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-1 text-center">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-10 w-full" />
        </div>

        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

// ------------------------------
// Fallback de erro
// ------------------------------
function LoginErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-destructive">Oops, algo deu errado</h2>
        <p className="text-muted-foreground mt-2">{error.message}</p>
      </div>
      <Button onClick={resetErrorBoundary} variant="outline">
        Tentar novamente
      </Button>
    </div>
  );
}

// ------------------------------
// Tela completa de login
// ------------------------------
export function LoginFormEnviar() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <ErrorBoundary FallbackComponent={LoginErrorFallback}>
              <Suspense fallback={<LoginLoading />}>
                <LoginForm />
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>
      </div>
      <div className=" relative hidden bg-gray-800 bg-opacity-30 lg:block">
        <img
          src={ImagemLogin}
          alt="Imagem"
          className="absolute inset-0 h-full w-full opacity-10  object-cover dark:brightness-[0.2] dark:grayscale"
        />
        <div className="absolute size-96 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-card p-2 text-5xl flex flex-col items-center justify-center">
          <img src={LogoHorizon} />

          <h1 >Horizon System</h1>

        </div>
      </div>
    </div>
  );
}
