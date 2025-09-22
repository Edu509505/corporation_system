// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   CircleAlert,
//   CircleArrowLeftIcon,
//   CircleCheck,
//   CircleFadingPlusIcon,
//   CircleX,
// } from "lucide-react";
// import { useState } from "react";
// import { Form, useNavigate } from "react-router-dom";
import { cnpj } from "cpf-cnpj-validator";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
//   SelectGroup,
//   SelectLabel,
// } from "@/components/ui/select";
// import { Label } from "@/components/ui/label";
// import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// import {
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  // Form,
  useForm,
  // type FieldValue,
  // type SubmitHandler,
} from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// import type { TypeOf } from "zod/v3";
import { Button } from "@/components/ui/button";
import { useState } from "react";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import path from "path";
// import { Label } from "@radix-ui/react-select";
import {
  CircleArrowLeftIcon,
  CircleCheck,
  CircleFadingPlusIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import { AlertDialogContent } from "@radix-ui/react-alert-dialog";
// import { Link } from "react-router-dom";
// interface Cliente {
//   cliente: string;
//   cnpj: string;
//   local: string;
//   status: string;
//   file: File | null;
// }

const url = import.meta.env.VITE_API_URL;
//Qualquer Link relacionado ao Back-End sempre importar o .env como boa prática

const criarClienteSchema = z.object({
  cliente: z
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
  status: z.string().nonempty("Campo Obrigatório"),
});

type CriarClienteFromData = z.infer<typeof criarClienteSchema>;

export default function CriarCliente() {
  const [resonseOk, setResponseOk] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CriarClienteFromData>({
    resolver: zodResolver(criarClienteSchema),
  });

  const onSubmit = async (data: CriarClienteFromData) => {
    try {
      const response = await fetch(`${url}/clientes`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        // Aqui você lida com o erro de forma clara
        setResponseOk(false);
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }

      const body = await response.json();
      setResponseOk(true);
      console.log("Cliente criado com sucesso:", body);
    } catch (error) {
      console.error("Falha ao criar cliente:", error);
      setResponseOk(false);
    }
  };

  // console.log("handleSubmit", handleSubmit);

  return (
    <div className="w-full h-screen flex flex-col bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex gap-3 flex-col p-5"
      >
        <div className="flex gap-3 items-center">
          <CircleFadingPlusIcon className="size-10" />
          <h1 className="text-2xl font-bold">Cadastrar novo Cliente</h1>
        </div>

        <h1>Insira o nome do cliente</h1>
        {errors.cliente && <h1>{errors.cliente.message}</h1>}
        <Input
          type="text"
          placeholder="Nome do cliente"
          {...register("cliente")}
          className="bg-white"
        />

        <h1>Insira o cnpj do cliente</h1>
        {errors.cnpj && <h1>{errors.cnpj.message}</h1>}
        <Input
          type="text"
          maxLength={18}
          placeholder="Cnpj do cliente"
          {...register("cnpj")}
          className="bg-white"
        />

        <h1>Insira o local do cliente</h1>
        {errors.local && <h1>{errors.local.message}</h1>}
        <Input
          type="text"
          placeholder="local do cliente"
          {...register("local")}
          className="bg-white"
        />

        <h1>Insira a situação inicial</h1>
        {errors.status && <h1>{errors.status.message}</h1>}
        <select {...register("status", { required: true })}>
          <option value="Ativo">Ativo</option>
          <option value="Pendente">Pendente</option>
          <option value="Inativo">Inativo</option>
        </select>
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

          <Button type="submit" variant="default" className="cursor-pointer">
            <CircleCheck /> Cadastrar
          </Button>
          {/* <AlertDialog>
            <AlertDialogTrigger asChild>
            </AlertDialogTrigger>
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
                  <AlertDialogAction className="cursor-pointer">
                    Continuar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogHeader>
            </AlertDialogContent>
          </AlertDialog> */}
        </div>
      </form>
    </div>
  );
}
