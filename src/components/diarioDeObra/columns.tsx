import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns/format";
import VisualizarDiarioDeObra from "./visualizarDiarioDeObra";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export interface DiarioDeObra {
  createdAt: string;
  dataDia: string;
  id: number;
  idMedicao: number | null;
  idProposta: number;
  updatedAt: string;
  propostaDiario: {
    createdAt: string;
    descricao: string;
    id: number;
    idCliente: number;
    nomeDaProposta: string;
    statusProposta: string;
    updatedAt: string;
    valorProposta: number;
    cliente: {
      cnpj: string;
      createdAt: string;
      id: number;
      local: string;
      name: string;
      path: string;
      status: string;
      updatedAt: string;
    };
  };
}

export const columns: ColumnDef<DiarioDeObra>[] = [
  {
    id: "dataDia",
    accessorKey: "dataDia",
    header: () => <>Data</>,
    cell: ({ row }) => {
      const data = row.getValue("dataDia");
      return format(new Date(data as string), "dd/MM/yyyy");
    },
  },
  {
    id: "propostaDiario.cliente.name",
    accessorKey: "propostaDiario.cliente.name",
    header: "Cliente",
  },
  {
    id: "propostaDiario.nomeDaProposta",
    accessorKey: "propostaDiario.nomeDaProposta",
    header: "Obra",
  },
  {
    id: "acoes",
    header: () => <>Ações</>,
    cell: ({ row }) => {
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button className="rounded-2xl bg-blue-100 text-blue-600 border-blue-600 border-1 hover:bg-blue-600 hover:text-white cursor-pointer h-8 w-21">
              Visualizar
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                Diário de Obra -{" "}
                {format(new Date(row.original.dataDia), "dd/MM/yyyy")}
              </DialogTitle>
              <DialogDescription>
                Visualização do diário de Obra
              </DialogDescription>
            </DialogHeader>
            <VisualizarDiarioDeObra id={row.original.id} />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" className="cursor-pointer">Fechar</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    },
  },
];
