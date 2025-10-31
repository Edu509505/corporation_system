import { cnpj } from "cpf-cnpj-validator";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useState } from "react";
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

const url = import.meta.env.VITE_API_URL;
//Qualquer Link relacionado ao Back-End sempre importar o .env como boa prática

const criarClienteSchema = z.object({
  name: z
    .string()
    .min(3, "Escreva um nome válido")
    .nonempty("Campo Obrigatório"),
  cnpj: z
    .string()
    .min(18, "Escreva um cnpj válido")
    .refine((val) => cnpj.isValid(val), "Cnpj Inválido")
    .nonempty("Campo Obrigatório"),
  local: z
    .string()
    .min(3, "Escreva um nome válido")
    .nonempty("Campo Obrigatório"),
  status: z.literal(["ATIVO", "INATIVO"], "Campo Obrigatório"),
  path: z.string(),
});

export default function CriarCliente() {
  //type CriarClienteFromData = z.infer<typeof criarClienteSchema>;

  const formCliente = useForm<z.infer<typeof criarClienteSchema>>({
    resolver: zodResolver(criarClienteSchema),
    defaultValues: {
      name: "",
      cnpj: "",
      local: "",
      status: "" as "ATIVO" | "INATIVO",
      path: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof criarClienteSchema>) => {
    console.log(data);

    try {
      const response = await fetch(`${url}/clientes`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
      });

      console.log("parei aqui");

      if (!response.ok) {
        // Aqui você lida com o erro de forma clara
        setResponseOk(false);
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }
      console.log("estou aqui");
      const body = await response.json();
      setResponseOk(true);
      console.log("Cliente criado com sucesso:", body);
    } catch (error) {
      console.error("Falha ao criar cliente:", error);
      setResponseOk(false);
    }
  };

  const [responseOk, setResponseOk] = useState(false);

  // console.log("handleSubmit", handleSubmit);

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
            <Link to={"/clientes"}>
              <Button
                type="button"
                variant="destructive"
                className="cursor-pointer"
              >
                <CircleArrowLeftIcon /> Voltar
              </Button>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="submit"
                  variant="default"
                  className="cursor-pointer"
                >
                  <CircleCheck /> Cadastrar
                </Button>
              </AlertDialogTrigger>
              {!responseOk ? (
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
                        Continuar
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
