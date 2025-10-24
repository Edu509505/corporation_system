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
  type OnChangeFn,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Filter } from "lucide-react";
// import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
// import { Link } from "react-router-dom";
//import { number } from "zod";
// import { Label } from "./ui/label";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  columnFilters?: ColumnFiltersState;
  setColumnFilters?: OnChangeFn<ColumnFiltersState>
  DadosValorVazio: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  columnFilters,
  setColumnFilters,
  DadosValorVazio,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
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
            {table.getFooterGroups().map(footerGroup => (
              <div className="flex flex-col gap-3">
             
                {footerGroup.headers.map(header => (
                  <div key={header.id}>
                    {header.isPlaceholder
                      ? null // Handle placeholder headers if needed
                      : flexRender(header.column.columnDef.footer, header.getContext())}
                  </div>
                ))}
              </div>
            ))}
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

                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {DadosValorVazio}
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
