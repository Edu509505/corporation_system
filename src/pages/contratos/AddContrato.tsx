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

const url = import.meta.env.VITE_API_URL;

interface Cliente {
  cliente: string;
  cnpj: string;
  proposta: string;
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

  const clienteNomes = clientes ? clientes.map((c) => c.cliente) : [];

  const contratoSchema = z.object({
    titulo: z.string().min(1, "Título é obrigatório"),
    descricao: z.string().min(1, "Descrição é obrigatória"),
    //local: z.string().min(1, "Local é obrigatório"),
    cliente: z.enum(
      clienteNomes as [string, ...string[]],
      "Selecione um cliente válido"
    ),
    proposta: z.literal(["sim", "não"]),
  });

  console.log(clientes);

  const form = useForm<z.infer<typeof contratoSchema>>({
    resolver: zodResolver(contratoSchema),
    defaultValues: {
      titulo: "",
      descricao: "",
      proposta: "" as "sim" | "não",
      //local: "",
    },
  });

  function onSubimit(data: z.infer<typeof contratoSchema>) {
    console.log(data);
  }
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
                name="cliente"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <FormMessage />
                    <Select
                      onValueChange={field.onChange}
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
                              key={cliente.cliente}
                              value={cliente.cliente}
                            >
                              {cliente.cliente}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="proposta"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proposta</FormLabel>
                    <FormMessage />
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
                          <SelectItem value="sim">sim</SelectItem>
                          <SelectItem value="não">não</SelectItem>
                          {/* {clientes?.map((proposta) => (
                            <SelectItem
                              key={proposta.proposta}
                              value={proposta.proposta}
                            >
                              {proposta.proposta}
                            </SelectItem>
                          ))} */}
                        </SelectGroup>
                      </SelectContent>
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
            <Button type="submit" className="mt-4" variant="default">
              Cadastrar Contrato
            </Button>
          </form>
        </Form>
      </main>
    </div>
  );
}

export default AddContrato;
