import type { ColumnDef } from "@tanstack/react-table";
//import { CircleAlertIcon, CircleCheck, CircleX } from "lucide-react";
import StatusDeAprovacao from "./StatusDeAprovaao";
// import { id } from "zod/v4/locales";
import { Link } from "react-router-dom";
import { TableCell } from "../ui/table";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import dayjs from "dayjs";

export type Propostas = {
  id: number;
  nomeDaProposta: string;
  statusProposta: string;
  createdAt: string | null;
  descricao: string;
  valorProposta: string;
  name: {
    cliente: string;
    local: string;
  };
};

export const columns: ColumnDef<Propostas>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: "Número",
  },
  {
    id: "cliente.name",
    accessorKey: "cliente.cliente",
    header: "Empresa",
    footer: ({ column }) => {
      return (
        <>
          <Label>Nome da empresa</Label>
          <Input
            placeholder="Empresas"
            value={String(column.getFilterValue() ?? "")}
            onChange={(e) => column.setFilterValue(e.target.value)}
          />
        </>
      );
    },
  },
  {
    id: "nomeDaProposta",
    accessorKey: "nomeDaProposta",
    header: "Nome Da Proposta",
  },
  {
    accessorKey: "statusProposta",
    header: () => <div className="text-center">Situação</div>,
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center">
          <StatusDeAprovacao status={row.getValue("statusProposta")} />
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Emissão",
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string | null;
      let data = createdAt ? dayjs(createdAt).format("DD/MM/YYYY") : "";
      return <div>{data as string}</div>;
    },
  },
  {
    accessorKey: "valorProposta",
    header: () => <div className="text-right">Valor</div>,
    cell: ({ row }) => {
      const valor = parseFloat(row.getValue("valorProposta"));
      const formatted = new Intl.NumberFormat("PT-BR", {
        style: "currency",
        currency: "BRL",
      }).format(valor);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    id: "acoes",
    header: () => <div className="text-center">Ações</div>,
    cell: ({ row }) => {
      return (
        <Link to={`/proposta/versionamento/${row.original.id}`}>
          <TableCell colSpan={columns.length} className="flex justify-center">
            <div className="flex justify-center w-24 p-2 rounded-full bg-blue-200 text-blue-900 hover:bg-blue-500 hover:text-white transition">
              <p>Visualizar</p>
            </div>
          </TableCell>
        </Link>
      );
    },
  },
];
