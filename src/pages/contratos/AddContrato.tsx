import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";
import { useState } from "react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Paperclip } from "lucide-react";

const url = import.meta.env.VITE_API_URL;

interface Cliente {
  id: number;
  cliente: string;
  cnpj: string;
  proposta: string;
}

interface Propostas {
  id: number;
  idCliente: number;
  nomeDaProposta: string;
  statusProposta: string;
}

function AddContrato() {
  const { data: clientes } = useQuery({
    queryKey: ["clientes"],
    queryFn: async () => {
      const response = await fetch(`${url}/clientes/`);
      if (!response.ok) throw new Error("Clientes não encontrados");
      const data = await response.json();
      return data as Cliente[];
    },
  });

  const [idCliente, setIdCliente] = useState({ id: "" });

  const { data: propostasAprovadas } = useQuery({
    queryKey: ["cliente", idCliente],
    queryFn: async () => {
      if (idCliente.id !== "") {
        const response = await fetch(
          `${url}/cliente/${idCliente.id}/propostasAprovadas`
        );
        if (!response.ok) throw new Error("Propostas não encontradas");
        const data = await response.json();
        return data as Propostas[];
      } else {
        return;
      }
    },
  });

  const contratoSchema = z.object({
    titulo: z.string().min(1, "Título é obrigatório"),
    idCliente: z.string().min(1, "Selecione ao menos um cliente"),
    idProposta: z.string().min(1, "Selecione ao menos uma proposta"),
    anexo: z
      .any()
      .refine(
        (files) => files?.length >= 1,
        "Você deve selecionar ao menos um arquivo"
      )
      .refine(
        (files) => files?.[0]?.size <= 15 * 1024 * 1024,
        "Arquivo deve ter até 50MB"
      )
      .refine(
        (files) =>
          ["image/jpeg", "image/png", "application/pdf"].includes(
            files?.[0]?.type
          ),
        "Tipo de arquivo inválido"
      ),
    // .file()
    // .min(1, "Selecione ao menos um arquivo")
    // .max(50 * 1024 * 1024, "Arquivo deve ter até 50MB")
    // .mime(
    //   ["image/jpeg", "image/png", "application/pdf"],
    //   "Selecione um tipo de arquivo válido"
    // ),
  });

  const form = useForm<z.infer<typeof contratoSchema>>({
    resolver: zodResolver(contratoSchema),
    defaultValues: {
      idCliente: "",
      titulo: "",
      anexo: undefined,
      idProposta: "",
    },
  });

  const onSubimit = async (data: z.infer<typeof contratoSchema>) => {
    console.log("data ", data);
    console.log("files: ", data.anexo.length);

    try {
      const response = await fetch(`${url}/contrato`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          anexos: Array.from(data.anexo)
        }),
      });
      if (!response.ok) {
        // Aqui você lida com o erro de forma clara
        //setResponseOk(false);
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }
      console.log("estou aqui");
      const body = await response.json();
      //setResponseOk(true);
      console.log("Cliente criado com sucesso:", body);
    } catch {}
  };

  return (
    <div className="flex flex-col bg-gray-50 h-full gap-3 p-4">
      <header>
        <h1 className="text-2xl font-bold">Adicionar Contrato</h1>
        <p className="text-gray-600">
          Preencha os detalhes do novo contrato abaixo.
        </p>
        <p className="text-sm text-gray-500">
          <strong>Atenção:</strong> O preenchimento do contrato deve ser
          realizado em comum acordo entre ambas as partes envolvidas, garantindo
          que todas as informações estejam corretas, completas e devidamente
          validadas. É fundamental que os dados inseridos reflitam fielmente os
          termos negociados, evitando divergências futuras e assegurando a
          conformidade legal do documento.
        </p>
      </header>
      <main className="">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubimit)}
            className="flex flex-col gap-4"
          >
            <div className="flex gap-4 flex-wrap">
              <FormField
                control={form.control}
                name="idCliente"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <Select
                      //value={idCliente.id}
                      onValueChange={(value) => {
                        setIdCliente({
                          ...idCliente,
                          id: value.toString(),
                        });
                        field.onChange(value);
                        propostasAprovadas;
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-[300px]">
                          <SelectValue placeholder="Selecionar cliente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="w-[300px]">
                        <SelectGroup>
                          <SelectLabel>Clientes</SelectLabel>
                          {clientes?.map((cliente) => (
                            <SelectItem
                              key={cliente.id}
                              value={cliente.id.toString()}
                            >
                              {cliente.cliente}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                      <FormMessage />
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="idProposta"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proposta</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={false}
                    >
                      <FormControl>
                        <SelectTrigger className="w-[300px]">
                          <SelectValue placeholder="Selecionar Proposta" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="w-[300px]">
                        <SelectGroup>
                          <SelectLabel>Proposta</SelectLabel>
                          {propostasAprovadas?.map((proposta) => (
                            <SelectItem
                              key={proposta.id}
                              value={proposta.id.toString()}
                            >
                              {proposta.nomeDaProposta}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                      <FormMessage />
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="titulo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <Input placeholder="Título do contrato" {...field} />
                  </FormControl>
                  <FormDescription>
                    Insira o título do contrato.
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="anexo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Escolha um arquivo</FormLabel>
                  <FormControl>
                    <Empty className="border border-dashed">
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <Paperclip />
                        </EmptyMedia>
                        <EmptyTitle>Selecione um Arquivo</EmptyTitle>
                        <EmptyDescription>
                          Escolha um aruivo de seu dispositivo para realizar o
                          Upload
                          <Input
                            className="cursor-pointer"
                            //{...field}
                            type="file"
                            multiple
                            accept=".jpg,.png,.pdf"
                            onChange={(e) => field.onChange(e.target.files)}
                          />
                        </EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="mt-4 cursor-pointer"
              variant="default"
            >
              Cadastrar Contrato
            </Button>
          </form>
        </Form>
      </main>
    </div>
  );
}

export default AddContrato;
