import type { ColumnDef } from "@tanstack/react-table";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Link } from "react-router-dom";
import { TableCell } from "../ui/table";

export type DiarioDeObra = {
  id: number;
  proposta: {
    propostaDiario: string;
    cliente: {
      name: string;
    }
  }
  idProposta: number;
  idQuantitativa: number;
  idDiarioDeObra: number;
  dataDia: Date;
  descricao: string;
  quantidade: number;
};

export const columnsDiario: ColumnDef<DiarioDeObra>[] = [
  {
    id: 'id',
    accessorKey: "id",
    header: "Número",
  },
  {
    id: 'propostaDiario.cliente.name',
    accessorKey: "propostaDiario.cliente.name",
    header: "Empresa",
    footer: ({ column }) => {
      return (
        <>
          <Label>Nome da empresa</Label>
          <Input
            placeholder="Empresas"
            value={String(column.getFilterValue() ?? '')}
            onChange={e => column.setFilterValue(e.target.value)}
          />
        </>
      )
    },
  },
  {
    id: 'propostaDiario.nomeDaProposta',
    accessorKey: "propostaDiario.nomeDaProposta",
    header: "Nome Da Obra",
  },
  {
    accessorKey: "dataDia",
    header: "Emissão",
    cell: ({ row }) => {
      const createdAt = row.getValue("dataDia") as string | null;
      let data = createdAt
        ? createdAt.split("T")[0].split("-").reverse().join("/")
        : "";
      return <div>{data}</div>;
    },
  },
  {
    id: 'acoes',
    header: () => <div className="text-center">Ações</div>,
    cell: ({ row }) => {
      return (
        <Link to={`/diarioPorProposta/${row.original.idProposta}`}>
          <TableCell
            colSpan={columnsDiario.length}
            className="flex justify-center"
          >
            <div className="flex justify-center w-24 p-2 rounded-full bg-blue-200 text-blue-900 hover:bg-blue-500 hover:text-white transition">
              <p>Visualizar</p>
            </div>
          </TableCell>
        </Link>
      )
    },
  }
];
