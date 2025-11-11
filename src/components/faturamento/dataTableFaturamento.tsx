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
} from "../ui/select";
import { useQuery } from "@tanstack/react-query";
import { Input } from "../ui/input";

const url = import.meta.env.VITE_API_URL;

interface Cliente {
  id: number;
  name: string;
  cnpj: string;
  proposta: string;
}

interface Propostas {
  id: number;
  idCliente: number;
  nomeDaProposta: string;
  statusProposta: string;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTableFaturamento<TData, TValue>({
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

  const { data: propostasAprovadas } = useQuery({
    queryKey: ["propostasAprovadas"],
    queryFn: async () => {
      const response = await fetch(`${url}/getTodasAsPropostasAprovedas`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Propostas não encontradas");
      const data = await response.json();
      return data as Propostas[];
    },
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
            <Label>Número da Nota</Label>
            <Input
              placeholder="Número da Nota"
              type="number"
              value={(table.getColumn("numeroDaNota")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("numeroDaNota")?.setFilterValue(event.target.value)
              }
              className="w-[150px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <div className="flex flex-col gap-3">
            <Label>Empresa</Label>

            <Select
              onValueChange={(event) =>
                table
                  .getColumn("clienteFaturamento.name")
                  ?.setFilterValue(event)
              }
              defaultValue={
                (table
                  .getColumn("clienteFaturamento.name")
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
                    <SelectItem key={clientes.name} value={clientes.name}>
                      {clientes.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-3">
            <Label>Obra</Label>

            <Select
              onValueChange={(event) =>
                table
                  .getColumn("propostaFaturamento.nomeDaProposta")
                  ?.setFilterValue(event)
              }
              defaultValue={
                (table
                  .getColumn("propostaFaturamento.nomeDaProposta")
                  ?.getFilterValue() as string) ?? ""
              }
            >
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Selecionar Proposta" />
              </SelectTrigger>

              <SelectContent className="w-[300px]">
                <SelectGroup>
                  <SelectLabel>Empresa</SelectLabel>
                  {propostasAprovadas?.map((proposta) => (
                    <SelectItem
                      key={proposta.nomeDaProposta}
                      value={proposta.nomeDaProposta}
                    >
                      {proposta.nomeDaProposta}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-3">
            <Label>Tipo</Label>
            <Select
              onValueChange={(event) =>
                table.getColumn("tipo")?.setFilterValue(event)
              }
              // value={
              //   (table.getColumn("tipo")?.getFilterValue() as string) ?? ""
              // }
              defaultValue={
                (table.getColumn("tipo")?.getFilterValue() as string) ?? ""
              }
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Selecionar tipo" />
              </SelectTrigger>

              <SelectContent className="w-[150px]">
                <SelectGroup>
                  <SelectLabel>Proposta</SelectLabel>
                  <SelectItem value="LOCACAO">Locação</SelectItem>
                  <SelectItem value="SERVICO">Serviço</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-3">
            

            {/* <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[200px] justify-start text-left font-normal"
                >
                  {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "Selecionar Data"}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  captionLayout="dropdown"
                />
              </PopoverContent>
            </Popover> */}

          </div>
          <div className="flex flex-col gap-3">
            <Label>Situação</Label>
            <Select
              onValueChange={(event) =>
                table.getColumn("pagamento")?.setFilterValue(event)
              }
              // value={
              //   (table.getColumn("tipo")?.getFilterValue() as string) ?? ""
              // }
              defaultValue={
                (table.getColumn("pagamento")?.getFilterValue() as string) ?? ""
              }
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Selecionar tipo" />
              </SelectTrigger>

              <SelectContent className="w-[150px]">
                <SelectGroup>
                  <SelectLabel>Situação</SelectLabel>
                  <SelectItem value="TODAS">Todas</SelectItem>
                  <SelectItem value="ABERTO">Em Aberto</SelectItem>
                  <SelectItem value="PAGA">Paga</SelectItem>
                  <SelectItem value="CANCELADA">Cancelada</SelectItem>
                  <SelectItem value="ATRASADA">Atrasada</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {/* <div className="flex flex-col gap-3">
            <Label>Emissão</Label>
            <Input
              placeholder="Emissão"
              type="date"
              value={(table.getColumn("createdAt")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("createdAt")?.setFilterValue(event.target.value)
              }
              className="max-w-sm no-calendar border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>
          <div className="flex flex-col gap-3">
            <Label>Vencimento</Label>
            <Input
              placeholder="Vencimento"
              type="date"
              value={(table.getColumn("vencimento")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("vencimento")?.setFilterValue(event.target.value)
              }
              className="max-w-sm no-calendar"
            />

          </div> */}
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
