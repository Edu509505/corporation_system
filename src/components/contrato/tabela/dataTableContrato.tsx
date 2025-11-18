import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  type SortingState,
  type ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import React from "react";
import { Filter } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { useQuery } from "@tanstack/react-query";

const url = import.meta.env.VITE_API_URL;

interface Cliente {
  id: number;
  name: string;
  cnpj: string;
  proposta: string;
}

interface Contrato {
  id: number;
  idCliente: number;
  idProposta: number;
  contrato: string;
  titulo: string;
  descricao: string;
  status: string;
  local: string;
  createdAt: string;
  clientesContratos: {
    name: string;
  };
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTableContratos<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  });


  const { data: clientes } = useQuery({
    queryKey: ["clientes"],
    queryFn: async () => {
      const response = await fetch(`${url}/clientes`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Clientes não encontrados");
      const data = await response.json();
      return data as Cliente[];
    },
  });

  const { data: contratos } = useQuery({
    queryKey: ["contratos"],
    queryFn: async () => {
      const response = await fetch(`${url}/contratos`, {
        method: "GET",
        credentials: "include"
      });
      if (!response.ok) throw new Error("Proposta não encontrada");
      const data = await response.json();
      return data as Contrato[];
  }
});

  return (
    <>
      <section className="flex flex-col">
        <div className="flex gap-3">
          <Filter />
          <h1 className="font-bold">Filtros</h1>
        </div>
        <div className="flex flex-wrap gap-3 py-3">
          <div className="flex flex-col gap-3">
            <Label>Empresa</Label>

            <Select
              onValueChange={(event) =>
                table
                  .getColumn("clientesContratos.name")
                  ?.setFilterValue(event)
              }
              defaultValue={
                (table
                  .getColumn("clientesContratos.name")
                  ?.getFilterValue() as string) ?? ""
              }
            >
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Selecionar Proposta" />
              </SelectTrigger>
              <SelectContent className="w-[300px]">
                <SelectGroup>
                  <SelectLabel>Empresa</SelectLabel>
                  {clientes?.map((clientes) => (
                    <SelectItem value={clientes.name}>
                      {clientes.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-3">
            <Label>Empresa</Label>

            <Select
              onValueChange={(event) =>
                table
                  .getColumn("titulo")
                  ?.setFilterValue(event)
              }
              defaultValue={
                (table
                  .getColumn("titulo")
                  ?.getFilterValue() as string) ?? ""
              }
            >
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Selecionar Proposta" />
              </SelectTrigger>
              <SelectContent className="w-[300px]">
                <SelectGroup>
                  <SelectLabel>Empresa</SelectLabel>
                  {contratos?.map((contratos) => (
                    <SelectItem value={contratos.titulo}>
                      {contratos.titulo}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>
      <div className="overflow-hidden rounded-md border">
        <Table className="bg-white">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && ""}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Sem Resultados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Voltar
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Avançar
        </Button>
      </div>
    </>
  );
}
