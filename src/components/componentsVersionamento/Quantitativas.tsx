import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Form, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useMutation } from "@tanstack/react-query";

const url = import.meta.env.VITE_API_URL;

interface funcoesQuantitativa {
  itemVersionamento: number;
}

//FORM DA QUATITATIVA

const itemSchema = z.object({
  idVersionamento: z.number(),
  descricao: z.string().min(2, "Nome obrigatório"),
  unidadeDeMedida: z.string().min(1, "Unidade obrigatória"),
  quantidade: z.string(),
  valorUnitario: z.string(),
});

const formSchema = z.object({
  itens: z.array(itemSchema).min(1, "Adicione pelo menos um item"),
});

type Quantitativas = {
  itens: {
    idVersionamento: number;
    descricao: string;
    quantidade: string;
    valorUnitario: string;
    unidadeDeMedida: string;
  }[];
};

function Quantitativa({ itemVersionamento }: funcoesQuantitativa) {
  const form = useForm<Quantitativas>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itens: [],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "itens",
  });

  console.log(form.formState.errors);

  const onSubmit = async (data: Quantitativas) => {
    console.log(data);

    try {
      await fetch(`${url}/quantitativa`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
      });
    } catch {}
  };

  const { mutateAsync: updateVersionamento } = useMutation({
    mutationKey: ["updateVersionamento"],
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await fetch(`${url}/versionamento/${id}`, {
        method: "PUT", // ou PATCH, dependendo da sua API
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: status,
        }),
      });
      if (!response.ok) throw new Error("Versionamento não encontrado");
    },
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-3">
          <DialogHeader>
            <DialogTitle>Adocionar quantitativa</DialogTitle>
            <DialogDescription>
              Para proseguir, é necessário adicionar a quantitativa dessa
              proposta, item, unidade e preço
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-3 items-center border-1 border-gray-500 rounded-2xl p-4 scroll-auto">
            <div className="space-y-4">
              <div className="flex flex-col gap-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-start gap-1">
                    <FormField
                      control={form.control}
                      name={`itens.${index}.descricao`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome do item" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`itens.${index}.unidadeDeMedida`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unidade</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Unidade de medidKa"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`itens.${index}.quantidade`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantidade</FormLabel>
                          <FormControl>
                            <Input placeholder="Quantidade" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`itens.${index}.valorUnitario`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor</FormLabel>
                          <FormControl>
                            <Input placeholder="R$ -" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                onClick={() =>
                  append({
                    idVersionamento: itemVersionamento,
                    descricao: "",
                    unidadeDeMedida: "",
                    quantidade: "",
                    valorUnitario: "",
                  })
                }
              >
                Adicionar item
              </Button>
            </div>
          </div>
          <DialogFooter className="flex gap-3">
            <DialogClose>
              <Button
                variant="outline"
                type="button"
                className="cursor-pointer"
              >
                Fechar
              </Button>
            </DialogClose>
            <DialogClose>
              <Button
                className="cursor-pointer"
                type="submit"
                onClick={async () => {
                  await updateVersionamento({
                    id: itemVersionamento,
                    status: "APROVADA",
                  });
                }}
              >
                Definir Quantitativa
              </Button>
            </DialogClose>
          </DialogFooter>
        </div>
      </form>
    </Form>
  );
}

export default Quantitativa;
