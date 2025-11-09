import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";

export interface Faturamento {
  id: number;
  idCliente: number;
  idFaturamento: number;
  idMedicao: number;
  idProposta: number;
  tipo: String;
  updatedAt: String;
  valor: number;
  vencimento: String;
  pagamento: null;
  createdAt: String;
  clienteFaturamento: {
    cnpj: String;
    createdAt: String;
    id: number;
    local: String;
    name: String;
    path: String;
    status: String;
    updatedAt: String;
  };
  medicaoFaturamento: {
    createdAt: String;
    faturado: String;
    id: number;
    idCliente: number;
    idContrato: null;
    idProposta: number;
    observacao: String;
    periodoFinal: String;
    periodoInicial: String;
    updatedAt: String;
    valorTotal: number;
  };
  propostaFaturamento: {
    createdAt: String;
    descricao: String;
    id: number;
    idCliente: number;
    nomeDaProposta: String;
    statusProposta: String;
    updatedAt: String;
    valorProposta: number;
  };
}

export const columns: ColumnDef<Faturamento>[] = [
  // {
  //   accessorKey: "id",
  //   header: "Número",
  // },
  {
    id: "clienteFaturamento.name",
    accessorKey: "clienteFaturamento.name",
    header: "Empresa",
  },
  {
    id: "propostaFaturamento.nomeDaProposta",
    accessorKey: "propostaFaturamento.nomeDaProposta",
    header: "Obra",
  },
  {
    id: "tipo",
    accessorKey: "tipo",
    header: () => <>Tipo</>,
    cell: ({ row }) => {
      const tipo = row.getValue("tipo");
      return tipo === "LOCACAO" ? <>Locação</> : <>Serviço</>;
    },
  },
  {
    id: "pagamento",
    accessorKey: "pagamento",
    header: () => <>Pagamento</>,
    cell: ({ row }) => {
      const pagamento = row.getValue("pagamento");
      let status = "";

      if (pagamento === null) {
        status = "Em Aberto";
      } else if (pagamento === "pago") {
        status = "Pago";
      }
      return status;
    },
  },
  {
    accessorKey: "valor",
    header: () => <>Valor</>,
    cell: ({ row }) => {
      const valor = parseFloat(row.getValue("valor"));
      const formatted = new Intl.NumberFormat("PT-BR", {
        style: "currency",
        currency: "BRL",
      }).format(valor);
      return formatted;
    },
  },
  {
    id: "acoes",
    header: () => <>Ações</>,
    cell: ({ row }) => {
      return (
        <Link to={`/visualizarMedicao/${row.original.id}`}>
          <Button className="rounded-2xl bg-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white cursor-pointer">
            Visualizar
          </Button>
        </Link>
      );
    },
  },
];
