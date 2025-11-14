import { cnpj } from "cpf-cnpj-validator";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner"
import {
  CircleArrowLeftIcon,
  CircleCheck,
  CircleFadingPlusIcon,
  CircleX,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const url = import.meta.env.VITE_API_URL;
//Qualquer Link relacionado ao Back-End sempre importar o .env como boa prática

const criarClienteSchema = z.object({
  name: z
    .string()
    .min(3, "Escreva um nome válido")
    .nonempty("Campo Obrigatório"),
  cnpj: z
    .string()
    .refine((val) => val.length >= 14 ? cnpj.format(val) : !cnpj.format(val) ? { error: "Cnpj invélido" } : "")
    .refine((val) => cnpj.isValid(val), { error: "Cnpj Inválido" })
    .min(18, "Escreva um cnpj válido")
    .nonempty("Campo Obrigatório"),
  local: z
    .string()
    .min(3, "Escreva um nome válido")
    .nonempty("Campo Obrigatório"),
  status: z.literal(["ATIVO", "INATIVO"], "Campo Obrigatório"),
  path: z.string(),
})

export default function CriarCliente() {
  //type CriarClienteFromData = z.infer<typeof criarClienteSchema>;

  const formCliente = useForm<z.infer<typeof criarClienteSchema>>({
    resolver: zodResolver(criarClienteSchema),
    defaultValues: {
      name: "",
      cnpj: cnpj.format(""),
      local: "",
      status: "" as "ATIVO" | "INATIVO",
      path: "",
    },
  });

  const criarUsuario = useMutation({
  mutationKey: ['criarUsuario'],
  mutationFn: async (data: z.infer<typeof criarClienteSchema>) => {
    const response = await fetch(`${url}/clientes`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Erro ${response.status}: ${errorText}`)
    }

    return response.json()
  },
})


  const onSubmit = async (data: z.infer<typeof criarClienteSchema>) => {
  toast.promise(
    criarUsuario.mutateAsync(data),
    {
      loading: 'Cadastrando cliente...',
      success: () => 'Cliente cadastrado com sucesso!',
      error: (err) => `Erro: ${(err as Error).message}`,
    }
  )
  formCliente.reset()
}


  return (
    <div className="w-full h-screen flex flex-col p-4 gap-3 bg-gray-50">
      <div className="flex gap-3 items-center">
        <CircleFadingPlusIcon className="size-10" />
        <h1 className="text-2xl font-bold">Cadastrar novo Cliente</h1>
      </div>
      <Form {...formCliente}>
        <form
          onSubmit={formCliente.handleSubmit(onSubmit)}
          className="flex gap-3 flex-col"
        >
          <FormField
            control={formCliente.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Cliente</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do cliente" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formCliente.control}
            name="cnpj"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Insira o CNPJ</FormLabel>
                <FormControl>
                  <Input placeholder="CNPJ" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formCliente.control}
            name="local"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Escolha um Local</FormLabel>
                <FormControl>
                  <Input placeholder="Local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formCliente.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-[300px]">
                      <SelectValue placeholder="Selecionar Proposta" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="w-[300px]">
                    <SelectGroup>
                      <SelectLabel>Proposta</SelectLabel>
                      <SelectItem value="ATIVO">Ativo</SelectItem>
                      <SelectItem value="INATIVO">Inativo</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formCliente.control}
            name="path"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Domínio Opicional</FormLabel>
                <FormControl>
                  <Input placeholder="Domínio" {...field} />
                </FormControl>
                <FormLabel className="text-gray-500">
                  O cliente possui algum domínio? Exemplo: cliente.com.br
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-3">
            <Link to="/clientes">
              <Button
                type="button"
                variant="destructive"
                className="cursor-pointer"
              >
                <CircleArrowLeftIcon /> Voltar
              </Button>
            </Link>
            <AlertDialog open={criarUsuario.isSuccess || criarUsuario.isError}>
              <AlertDialogTrigger asChild>
                <Button type="submit" disabled={criarUsuario.isPending} className="cursor-pointer">
                  {criarUsuario.isPending ? <><Spinner /> Cadastrar</> : <><CircleCheck /> Cadastrar</>}
                </Button>
              </AlertDialogTrigger>
              {criarUsuario.isError ? (
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-3 text-destructive">
                      <CircleX />
                      Não foi possível cadastrar o usuário
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Tente novamente mais tarde
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="cursor-pointer">
                        Voltar
                      </AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogHeader>
                </AlertDialogContent>
              ) : (
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-3 text-ring">
                      <CircleCheck />
                      Usuário cadastrado com sucesso
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Usuário cadastrado e inserido no sistema
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                      <Link to={"/clientes"}>
                        <AlertDialogAction className="cursor-pointer">
                          Continuar
                        </AlertDialogAction>
                      </Link>
                    </AlertDialogFooter>
                  </AlertDialogHeader>
                </AlertDialogContent>
              )}
            </AlertDialog>
          </div>
        </form>
      </Form>
    </div>
  );
}
