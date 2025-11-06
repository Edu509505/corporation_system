import type { ColumnDef } from "@tanstack/react-table";

export interface Medicao {
  id: number;
  idCliente: number;
  idProposta: number;
  observacao: string;
  periodoInicial: string;
  periodoFinal: string;
  faturado: string;
  valorTotal: number;
}

export const columns: ColumnDef<Medicao>[] = [
  {
    accessorKey: "id",
    header: "Número",
  },
  {
    accessorKey: "idCliente",
    header: "Empresa",
  },
  {
    accessorKey: "idProposta",
    header: "Obra",
  },
  {
    accessorKey: "faturado",
    header: "Situação",
  },
  {
    accessorKey: "valorTotal",
    header: () => <>Valor</>,
    cell: ({ row }) => {
      const valor = parseFloat(row.getValue("valorTotal"));
      const formatted = new Intl.NumberFormat("PT-BR", {
        style: "currency",
        currency: "BRL",
      }).format(valor);
      return formatted;
    },
  },
];
