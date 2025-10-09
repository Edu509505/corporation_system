import * as React from "react";

import {
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EyeIcon, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { number } from "zod";
import { Label } from "../ui/label";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
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
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div>
      <article>
        <div className="flex">
          <Filter />
          <h3>Filtros</h3>
        </div>
        <div className="flex w-full items-center py-4 gap-2 justify-between">
          <div className="flex flex-col gap-3">
            <Label>Nome da empresa</Label>
            <Input
              placeholder="Empresas"
              value={
                (table
                  .getColumn("cliente.cliente")
                  ?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table
                  .getColumn("cliente.cliente")
                  ?.setFilterValue(event.target.value)
              }
            />
          </div>
          <div className="flex flex-col gap-3">
            <Label>Nome da proposta</Label>
            <Input
              placeholder="Nome Da Proposta"
              value={
                (table
                  .getColumn("nomeDaProposta")
                  ?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table
                  .getColumn("nomeDaProposta")
                  ?.setFilterValue(event.target.value)
              }
            />
          </div>
          <div className="flex flex-col gap-3">
            <Label>Situação</Label>
            <Input
              placeholder="Situação"
              value={
                (table
                  .getColumn("statusProposta")
                  ?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table
                  .getColumn("statusProposta")
                  ?.setFilterValue(event.target.value)
              }
            />
          </div>
          <div className="flex flex-col gap-3">
            <Label>Data de emissão</Label>
            <Input
              placeholder="Data"
              value={
                (table.getColumn("createdAt")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("createdAt")?.setFilterValue(event.target.value)
              }
            />
          </div>
          <div className="flex flex-col w-auto">
            <Label>Valor da proposta</Label>
            <Input
              type="String"
              placeholder="Valor Da Proposta"
              value={
                table.getColumn("valorProposta")?.getFilterValue() as
                  | string
                  | number
              }
              onChange={(event) =>
                table
                  .getColumn("valorProposta")
                  ?.setFilterValue(event.target.value)
              }
            />
          </div>
        </div>
      </article>
      <div className="overflow-hidden rounded-md border">
        <Table className="border-b-2 rounded-xl border-b-ring">
          <TableHeader className="bg-gray-200 ">
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
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                  <Link to={`/proposta/versionamento/${row.original.id}`}>
                    <TableCell
                      colSpan={columns.length}
                      className="flex justify-center"
                    >
                      <div className="flex justify-center w-24 p-2 rounded-full bg-blue-200 text-blue-900 hover:bg-blue-500 hover:text-white transition">
                        <p>Visualizar</p>
                      </div>
                    </TableCell>
                  </Link>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhuma proposta encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4 ">
        <Button
          className="cursor-pointer bg-ring text-white"
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Retornar
        </Button>
        <Button
          className="cursor-pointer bg-ring text-white"
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Avançar
        </Button>
      </div>
    </div>
  );
}
