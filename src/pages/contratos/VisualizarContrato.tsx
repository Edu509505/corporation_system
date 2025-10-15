import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { cnpj } from "cpf-cnpj-validator";

const url = import.meta.env.VITE_API_URL;

interface Contratos {
  id: number;
  titulo: string;
  status: string;
  createdAt: string;
  clientesContratos: {
    id: number;
    cliente: string;
    cnpj: string;
    local: string;
  };
  proposta: {
    id: number;
    nomeDaProposta: string;
    descricao: string;
    valorProposta: number;
    updatedAt: string;
  };
}

function VisualizarContrato() {
  const { id } = useParams<{ id: string }>();

  const { data: dadosCliente } = useQuery({
    queryKey: ["cliente"],
    queryFn: async () => {
      const response = await fetch(`${url}/contrato/${id}`);
      if (!response.ok) throw new Error("Cliente não encontrato");
      const data = await response.json();
      console.log("data: ", data);
      return data as Contratos;
    },
  });

  const { data: versionamento } = useQuery({
    queryKey: ["anexoVersionamento"],
    queryFn: async () => {
      const response = await fetch(
        `${url}/proposta/${dadosCliente?.proposta.id.toString()}/versionamentos`
      );
      if (!response.ok) throw new Error("Versionamento não encontrada");
      const data = await response.json();
      return data;
    },
  });

  console.log(versionamento);

  console.log("idCliente", dadosCliente?.clientesContratos.id);

  return (
    <div className="w-full flex flex-wrap p-4">
      <div className="w-1/2 bg-amber-100 flex flex-col gap-3">
        <section>
          <h1 className="text-2xl">Informações do Cliente</h1>
          <h1>
            <strong>Cliente:</strong> {dadosCliente?.clientesContratos.cliente}
          </h1>
          <h1>
            <strong>CNPJ:</strong>{" "}
            {cnpj.format(dadosCliente?.clientesContratos.cnpj as string)}
          </h1>
          <h1>
            <strong>Local do Cliente:</strong>{" "}
            {dadosCliente?.clientesContratos.local}
          </h1>
        </section>
        <section>
          <h1 className="text-2xl">Informações do Contrato</h1>
          <h1>
            <strong>Contrato: </strong>
            {dadosCliente?.titulo}
          </h1>
          <h1>
            <strong>Criado em: </strong>{" "}
            {dadosCliente?.createdAt
              .split("T")[0]
              .split("-")
              .reverse()
              .join("/")}
          </h1>
        </section>
        <section>
          <h1 className="text-2xl">Proposta Referente ao contrato</h1>
          <h1>
            <strong>Proposta: </strong> {dadosCliente?.proposta.nomeDaProposta}
          </h1>
          <h1>
            <strong>Descrição: </strong> {dadosCliente?.proposta.descricao}
          </h1>
          <h1>
            <strong>Aprovada em: </strong>{" "}
            {dadosCliente?.proposta.updatedAt
              .split("T")[0]
              .split("-")
              .reverse()
              .join("/")}
          </h1>
          <h1>
            <strong>Valor: </strong> {dadosCliente?.proposta.valorProposta}
          </h1>
        </section>
      </div>
      <div className="w-1/2 flex bg-amber-50 flex-col gap-3">
        <div className="gap-3 flex flex-col border-1 border-gray-500">
          <h1 className="text-2xl">Anexos da Proposta</h1>
          {}
          <div className="rounded-2xl bg-emerald-400 flex gap-3 p-3"></div>
        </div>
      </div>
    </div>
  );
}

export default VisualizarContrato;
