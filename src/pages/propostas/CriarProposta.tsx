import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Cliente } from "@/Tipagens";
//import { formatToBRL } from "brazilian-values";
import { CircleCheck, CirclePlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const url = import.meta.env.VITE_API_URL;

interface formularioComImagem {
  nomeDaProposta: string;
  descricao: string;
  valorProposta: string;
  files: FileList | File[] | null;
}

export default function CriarProposta() {
  const [clientes, setClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    async function buscarClientes() {
      const empresas = await fetch(`${url}/clientes`,{
        method: "GET",
        credentials: "include"
      }
      );
      const body = await empresas.json();
      setClientes(body);
    }
    buscarClientes();
  }, []);

  const [clienteSelecionado, setClienteSelecionado] = useState({
    idCliente: "",
  });

  const [novaProposta, setNovaProposta] = useState<formularioComImagem>({
    nomeDaProposta: "",
    descricao: "",
    valorProposta: "",
    files: null,
  });

  console.log(novaProposta.valorProposta);

  async function criarProposta(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!novaProposta.files) return;
    console.log(
      "Quantidade de arquivos no frontend:",
      novaProposta.files.length
    );
    console.log("Arquivos:", novaProposta.files);

    const form = new FormData();

    form.set("idCliente", clienteSelecionado.idCliente);
    form.set("nomeDaProposta", novaProposta.nomeDaProposta);
    form.set("descricao", novaProposta.descricao);
    form.set("valorProposta", novaProposta.valorProposta);

    // Este código itera sobre todos os arquivos selecionados no input
    // e adiciona cada um individualmente ao FormData com a chave 'files'
    for (let i = 0; i < novaProposta.files.length; i++) {
      console.log("Adicionando arquivo:", novaProposta.files);
      form.append("files", novaProposta.files[i]);
    }

    console.log("Parei aqui");
    const response = await fetch(`${url}/proposta`, {
      method: "POST",
      credentials: "include",
      body: form,
    });

    const body = await response.json();
    console.log(body);
  }

  console.log("Cliente Selecionado: ", clienteSelecionado);
  console.log("Nova Proposta: ", novaProposta);

  const navigate = useNavigate();

  return (
    <>
      <div className="h-full p-5">
        <form onSubmit={criarProposta} className="flex flex-col gap-3">
          <div className="flex gap-3 items-center">
            <CirclePlusIcon className="size-8" />
            <h1 className="text-2xl font-bold">Criar nova Proposta</h1>
          </div>

          <Label>Selecione o Cliente</Label>
          <Select
            value={clienteSelecionado.idCliente}
            onValueChange={(value) => {
              setClienteSelecionado({
                ...clienteSelecionado,
                idCliente: value.toString(),
              });
            }}
          >
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Selecionar cliente" />
            </SelectTrigger>
            <SelectContent className="w-[300px]">
              <SelectGroup>
                <SelectLabel>Cliente</SelectLabel>
                {clientes.map((cliente) => (
                  <SelectItem key={cliente.id} value={cliente.id.toString()}>
                    {cliente.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Label>Insira o nome da proposta</Label>
          <Input
            type="text"
            name="nome da proposta"
            placeholder="digite aqui"
            value={novaProposta.nomeDaProposta}
            onChange={(event) =>
              setNovaProposta({
                ...novaProposta,
                nomeDaProposta: event.target.value,
              })
            }
          />

          <Label>Adicione uma descrição</Label>
          <Input
            type="text"
            name="descrição"
            placeholder="digite aqui"
            value={novaProposta.descricao}
            onChange={(event) =>
              setNovaProposta({
                ...novaProposta,
                descricao: event.target.value,
              })
            }
          />

          <Label>Qual o valor da proposta?</Label>
          <Input
            type="text"
            name="valor da proposta"
            placeholder="R$ -"
            value={novaProposta.valorProposta ?? ""}
            onChange={(event) =>
              setNovaProposta({
                ...novaProposta,
                valorProposta: event.target.value,
              })
            }
          />

          <Label>Adicionar Anexo</Label>
          <Input
            type="file"
            multiple
            onChange={(event) => {
              const files = event.target.files;
              if (!files) return;
              const filesArray = Array.from(files);
              setNovaProposta({
                ...novaProposta,
                files: filesArray,
              });
            }}
          />
          <div className="flex gap-3 ">
            <Button
              type="button"
              variant="destructive"
              className="cursor-pointer"
              onClick={() => navigate(-1)}
            >
              Retornar
            </Button>

            <Button type="submit" variant="default" className="cursor-pointer">
              <CircleCheck />
              Criar
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
