import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { Badge } from "../ui/badge";
import { CircleCheck, CircleX, Timer } from "lucide-react";
import { format } from "date-fns/format";

export interface DiarioDeObra {
  createdAt: string
  faturado: string
  id: number
  idCliente: number
  idContrato: number | null
  idProposta: number
  observacao: string
  periodoFinal: string
  periodoInicial: string
  updatedAt: string
  valorTotal: number
  clienteMedicao: {
    cnpj: string
    createdAt: string
    id: number
    local: string
    name: string
    path: string
    status: string
    updatedAt: string
  }
  propostaMedicao: {
    createdAt: string
    descricao: string
    id: number
    idCliente: number
    nomeDaProposta: string
    statusProposta: string
    updatedAt: string
    valorProposta: number
  }
}

export const columns: ColumnDef<DiarioDeObra>[] = [
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header:() => <>Data</>,
    cell: ({ row }) => {
      const data = row.getValue("createdAt")
      return format(new Date(data as string), "dd/MM/yyyy")
    }
  },
  {
    id: "cliente.name",
    accessorKey: "cliente.name",
    header: "Empresa",
  },
  {
    id: "nomeDaProposta",
    accessorKey: "nomeDaProposta",
    header: "Propostas",
  },
  // {
  //   id: "createdAt",
  //   filterFn: (row, columnId, filterValue) => {
  //     if (!filterValue) return true

  //     const rowDate = new Date(row.getValue(columnId))
  //     return format(rowDate, "dd/MM/yyyy") === format(filterValue, "dd/MM/yyyy")
  //   },
  //   accessorKey: "createdAt",
  //   header: () => <>Emissão</>,
  //   cell: ({ row }) => {
  //     const tipo = row.getValue("createdAt");
  //     return format(new Date(tipo as string), "dd/MM/yyyy")
  //   },
  // },
  {
    id: "statusProposta",
    // filterFn: (row, columnId, filterValue) => {
    //   if (!filterValue) return true

    //   const rowDate = new Date(row.getValue(columnId))
    //   return format(rowDate, "dd/MM/yyyy") === format(filterValue, "dd/MM/yyyy")
    // },
    accessorKey: "statusProposta",
    header: () => <>Situação</>,
    cell: ({ row }) => {
      const proposta = row.getValue("statusProposta");

      if (proposta === "EM_ANALISE") {
        return <Badge className="text-blue-600 bg-blue-100 border border-blue-500"><Timer /> Em Análise</Badge>
      } else if (proposta === "APROVADA") {
        return <Badge className="text-green-600 bg-green-100 border border-green-500"> <CircleCheck /> Aprovada </Badge>
      } else if (proposta === "CANCELADA") {
        return <Badge className="text-red-600 bg-red-100 border border-red-500"> <CircleX /> Cancelada </Badge>
      }
    },
  },
  // {
  //   id: "pagamento",
  //   accessorKey: "pagamento",
  //   filterFn: (row, columnId, filterValue) => {
  //     if (!filterValue || filterValue === "TODAS") return true

  //     const status = row.getValue(columnId) ?? "ABERTO"
  //     const vencimento = new Date(row.original.vencimento as string)

  //     if (filterValue === "ATRASADA") {
  //       return status === "ABERTO" && vencimento < new Date()
  //     }

  //     return status === filterValue

  //   },
  //   header: () => <>Situação</>,
  //   cell: ({ row }) => {
  //     const pagamento = row.getValue("pagamento");
  //     const data = row.original.vencimento

  //     console.log("CREATEDAT", data)
  //     if (pagamento === "ABERTO") {
  //       if (new Date() > new Date(data as string)) {
  //         return <Badge className="text-orange-600 bg-orange-100 border border-orange-500"> <AlertCircleIcon /> Em Atraso </Badge>
  //       }
  //       return <Badge className="text-blue-600 bg-blue-100 border border-blue-500"><Timer /> Em aberto</Badge>
  //     } else if (pagamento === "PAGA") {
  //       return <Badge className="text-green-600 bg-green-100 border border-green-500"> <CircleCheck /> Paga </Badge>
  //     } else if (pagamento === "CANCELADA") {
  //       return <Badge className="text-red-600 bg-red-100 border border-red-500"> <CircleX /> Cancelada </Badge>
  //     }
  //   },
  // },
  {
    accessorKey: "valorProposta",
    header: () => <>Valor da Proposta</>,
    cell: ({ row }) => {
      const valorProposta = parseFloat(row.getValue("valorProposta"));
      const formatted = new Intl.NumberFormat("PT-BR", {
        style: "currency",
        currency: "BRL",
      }).format(valorProposta / 100);
      return formatted;
    },
  },
  {
    id: "acoes",
    header: () => <>Ações</>,
    cell: ({ row }) => {
      return (
        <Link to={`/proposta/versionamento/${row.original.id}`}>
          <Button className="rounded-2xl bg-blue-100 text-blue-600 border-blue-600 border-1 hover:bg-blue-600 hover:text-white cursor-pointer h-8 w-21">
            Visualizar
          </Button>
        </Link>
      );
    },
  },
];
