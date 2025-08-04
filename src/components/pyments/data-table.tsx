'use client'

import * as React from "react"

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
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { EyeIcon, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "../ui/button"


interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )

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
  })

  return (
    <div>
      <article>
        <div className="flex">
          <Filter />
          <h3>Filtros</h3>
        </div>
        <div className="flex w-full items-center py-4 gap-2 justify-between">
        <Input
          placeholder="Empresas"
          value={(table.getColumn("empresa")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("empresa")?.setFilterValue(event.target.value)
          }
          className="w-1/4"
        />
        <Input
          placeholder="Situação"
          value={(table.getColumn("situacao")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("situacao")?.setFilterValue(event.target.value)
          }
          className="w-1/4"
        />
        <Input
          placeholder="Data"
          value={(table.getColumn("emissao")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("emissao")?.setFilterValue(event.target.value)
          }
          className="w-1/4"
        />
        <Input
          placeholder="local"
          value={(table.getColumn("local")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("local")?.setFilterValue(event.target.value)
          }
          className="w-1/4"
        />
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
                  )
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
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                  <TableCell colSpan={columns.length}>
                    <div className="flex justify-center items-center w-full h-full cursor-pointer">
                      <EyeIcon />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Nada encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div >
      <div className="flex items-center justify-end space-x-2 py-4 ">
        <Button className="cursor-pointer bg-ring text-white"
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Retornar
        </Button>
        <Button className="cursor-pointer bg-ring text-white"
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Avançar
        </Button>
      </div>
    </div>
  )
}