import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { Badge } from "../ui/badge";
import { AlertCircleIcon, CircleCheck, CircleX, Timer } from "lucide-react";
import { format } from "date-fns";

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
  createdAt: string;
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
    id: "numeroDaNota",
    accessorKey: "numeroDaNota",
    header: "Número",
  },
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
    id: "createdAt",
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue) return true;

      const rowDate = new Date(row.getValue(columnId));
      return (
        format(rowDate, "dd/MM/yyyy") === format(filterValue, "dd/MM/yyyy")
      );
    },
    accessorKey: "createdAt",
    header: () => <>Emissão</>,
    cell: ({ row }) => {
      const tipo = row.getValue("createdAt");
      return format(new Date(tipo as string), "dd/MM/yyyy");
    },
  },
  {
    id: "vencimento",
    accessorKey: "vencimento",
    header: () => <>Vencimento</>,
    cell: ({ row }) => {
      const tipo = row.getValue("vencimento");
      return format(new Date(tipo as string), "dd/MM/yyyy");
    },
  },
  {
    id: "pagamento",
    accessorKey: "pagamento",
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue === "TODAS") return true;

      const status = row.getValue(columnId) ?? "ABERTO";
      const vencimento = new Date(row.original.vencimento as string);

      if (filterValue === "ATRASADA") {
        return status === "ABERTO" && vencimento < new Date();
      }

      return status === filterValue;
    },
    header: () => <>Situação</>,
    cell: ({ row }) => {
      const pagamento = row.getValue("pagamento");
      const data = row.original.vencimento;

      if (pagamento === "ABERTO") {
        if (new Date() > new Date(data as string)) {
          return (
            <Badge className="text-orange-600 bg-orange-100 border border-orange-500">
              {" "}
              <AlertCircleIcon /> Em Atraso{" "}
            </Badge>
          );
        }
        return (
          <Badge className="text-blue-600 bg-blue-100 border border-blue-500">
            <Timer /> Em aberto
          </Badge>
        );
      } else if (pagamento === "PAGA") {
        return (
          <Badge className="text-green-600 bg-green-100 border border-green-500">
            {" "}
            <CircleCheck /> Paga{" "}
          </Badge>
        );
      } else if (pagamento === "CANCELADA") {
        return (
          <Badge className="text-red-600 bg-red-100 border border-red-500">
            {" "}
            <CircleX /> Cancelada{" "}
          </Badge>
        );
      }
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
      }).format(valor / 100);
      return formatted;
    },
  },
  {
    id: "acoes",
    header: () => <>Ações</>,
    cell: ({ row }) => {
      return (
        <Link to={`/visualizarNotaFiscal/${row.original.id}`}>
          <Button className="rounded-2xl bg-blue-100 text-blue-600 border-blue-600 border-1 hover:bg-blue-600 hover:text-white cursor-pointer h-8 w-21">
            Visualizar
          </Button>
        </Link>
      );
    },
  },
];
