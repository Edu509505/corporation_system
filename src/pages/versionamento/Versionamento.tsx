import { Button } from "@/components/ui/button";
import { Cigarette, CircleArrowLeftIcon, CircleCheckBig, CirclePlus, CircleX, Divide, Paperclip, TimerIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { cnpj } from "cpf-cnpj-validator";
import { da } from "zod/v4/locales";
import { DataTableDemo } from "@/components/pyments/teste";


//Bagulhos da tabela
import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const url = import.meta.env.VITE_API_URL;

interface Versionamento {
  id: number;
  versao: number;
  idProposta: number;
  status: string;
  createdAt: string;
}

interface Propostas {
  nomeDaProposta: string;
  descricao: string;
  createdAt: string;
  cliente: {
    cliente: string;
  };
}

interface Cliente {
  cliente: string;
  cnpj: string;
  local: string;
  status: string;
  file: File | null;
}

// interface AnexoVersionamento {
//   url: [string];
// }

const data: Payment[] = [
  {
    id: "m5gr84i9",
    amount: 316,
    status: "success",
    email: "ken99@example.com",
  },
  {
    id: "3u1reuv4",
    amount: 242,
    status: "success",
    email: "Abe45@example.com",
  },
  {
    id: "derv1ws0",
    amount: 837,
    status: "processing",
    email: "Monserrat44@example.com",
  },
  {
    id: "5kma53ae",
    amount: 874,
    status: "success",
    email: "Silas22@example.com",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    status: "failed",
    email: "carmella@example.com",
  },
]

export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

export const columns: ColumnDef<Versionamento>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

function Versionamento() {

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [proposta, setProposta] = useState<Propostas>({
    nomeDaProposta: "",
    descricao: "",
    createdAt: "",
    cliente: { cliente: "" },
  });

  const [cliente, setCliente] = useState<Cliente>({
    cliente: "",
    cnpj: "",
    local: "",
    status: "",
    file: null,
  });

  const [versionamento, setVersionamento] = useState<Versionamento[]>([
    {
      id: 0,
      versao: 0,
      idProposta: 0,
      status: "",
      createdAt: "",
    },
  ]);

  const [anexoVersionamento, setAnexoVersionamento] = useState<
    { url: string }[]
  >([]);

  useEffect(() => {
    async function fetchProposta() {
      try {
        const response = await fetch(`${url}/proposta/${id}`);
        if (!response.ok) throw new Error("Proposta não encontrada");
        const data = await response.json();
        setProposta({
          nomeDaProposta: data.nomeDaProposta || "",
          descricao: data.descricao || "",
          createdAt: data.createdAt || "",
          cliente: { cliente: data.cliente || "" },
        });
      } catch (err) { }
    }

    async function fetchCliente() {
      const response = await fetch(`${url}/cliente/${id}`);
      if (!response.ok) throw new Error("Cliente não encontrado");
      const data = await response.json();

      setCliente({
        cliente: data.cliente,
        cnpj: data.cnpj,
        local: data.local,
        status: data.status,
        file: null,
      });
    }

    async function fetchVersionamento() {
      const response = await fetch(`${url}/proposta/${id}/versionamentos`);
      if (!response.ok) throw new Error("Versionamento Não encontrado");
      const data = await response.json();

      setVersionamento(data);
    }

    async function fetchAnexoVersionamento() {
      const response = await fetch(`${url}/versionamento/${id}/anexos/urls`);
      if (!response.ok) throw new Error("Versionamento Não encontrado");
      const data = await response.json();

      const anexos = data.url.map((link: string) => ({ url: link }));

      setAnexoVersionamento(anexos);
      console.log("data", anexos);
    }

    // console.log("Anexo Versionamento: ", anexoVersionamento);
    if (id)
      fetchProposta(),
        fetchCliente(),
        fetchVersionamento(),
        fetchAnexoVersionamento();
    else {
      console.log("Deu erro aqui");
    }
  }, [id]);

  // console.log("versionamento", versionamento);
  console.log("Anexo Versionamento: ", anexoVersionamento);
  return (
    <div className="h-full flex flex-col p-3 gap-4">
      <Link to="/propostas">
        <Button
          variant="ghost"
          className="cursor-pointer"
        >
          <CircleArrowLeftIcon />
          Retornar
        </Button>
      </Link>
      <div className="flex items-start justify-between gap-4">
        <section>
          <h1 className="font-bold text-2xl">Versionamento de Proposta</h1>
          <h1>Nome da Proposta: {proposta.nomeDaProposta}</h1>
          <h1>
            Data:
            {proposta.createdAt.split("T")[0].split("-").reverse().join("/")}
          </h1>
          <h1>Cliente: {cliente.cliente}</h1>
          <h1>CNPJ: {cnpj.format(cliente.cnpj)}</h1>
        </section>

        <section className="flex flex-col gap-4">
          <div className="border-1 border-gray-400 rounded-2xl p-2 w-2xs">
            <h1 className="font-bold text-2xl flex items-center justify-start gap-3">Items anexados <Paperclip /></h1>
            {anexoVersionamento.length > 0 ? (
              anexoVersionamento.map((anexo, idx) => (
                <a key={idx} href={anexo.url} className=" bg-gray-500 cursor-pointer">
                  <h1>{idx + 1} Arquivo anexado</h1>
                </a>
              ))
            ) : (
              <span>Nenhum PDF encontrado.</span>
            )}
            <h1 className="text-[0.8rem]">Clique para efetuar o Download</h1>
          </div>

        </section>
      </div>
      <div className="h-[800px] border-1 border-gray-400 rounded-2xl">
        {/* <Table className=" h-[100%]">
          <TableHeader>
            <TableRow>
              <TableHead>Versão</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Quantidade de Anexos</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {versionamento.map((itemVersionamento) => (
              <TableRow key={itemVersionamento.id}>
                <TableCell className="font-bold">
                  {itemVersionamento.versao}
                </TableCell>
                <TableCell>
                  {itemVersionamento.createdAt
                    .split("T")[0]
                    .split("-")
                    .reverse()
                    .join("/")}
                </TableCell>
                <TableCell>{anexoVersionamento.length}</TableCell>
                <TableCell>{
                  itemVersionamento.status === 'EM_ANALISE' ?
                    <>
                      <div className="flex items-center justify-center gap-3 text-chart-1 bg-amber-50 rounded-2xl">
                        <TimerIcon />Em Análise
                      </div>
                    </>
                    : itemVersionamento.status === "REPROVADA" ?
                      <>
                        <div className="flex items-center justify-center gap-3 text-destructive bg-red-100 rounded-2xl">
                          <TimerIcon />Em Análise
                        </div>
                      </>
                      : itemVersionamento.status === "APROVADA" ?
                        <>
                          <div className="flex items-center justify-center gap-3 text-ring bg-green-100 rounded-2xl">
                            <TimerIcon />Em Análise
                          </div>
                        </>
                        : ''
                }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>
                <div className="flex items-center justify-between">
                  Ações
                  <div className="flex gap-3">
                    <Button variant="destructive" className="flex gap-2 items-center cursor-pointer">
                      <CircleX  />
                      Reprovada
                    </ Button>
                    <Button className="flex gap-2 items-center cursor-pointer">
                      <CircleCheckBig  />
                      Aprovada
                    </Button>
                    <Button variant="outline" className="flex gap-2 items-center cursor-pointer">
                      <CirclePlus />
                      Criar Nova Proposta
                    </Button>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table> */}
        <div className="flex items-center py-4">
                <Input
                  placeholder="Filter emails..."
                  value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
                  onChange={(event) =>
                    table.getColumn("email")?.setFilterValue(event.target.value)
                  }
                  className="max-w-sm"
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="ml-auto">
                      Columns <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {table
                      .getAllColumns()
                      .filter((column) => column.getCanHide())
                      .map((column) => {
                        return (
                          <DropdownMenuCheckboxItem
                            key={column.id}
                            className="capitalize"
                            checked={column.getIsVisible()}
                            onCheckedChange={(value) =>
                              column.toggleVisibility(!!value)
                            }
                          >
                            {column.id}
                          </DropdownMenuCheckboxItem>
                        )
                      })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="overflow-hidden rounded-md border">
                <Table>
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
                          )
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
                          No results.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="flex items-center justify-end space-x-2 py-4">
                <div className="text-muted-foreground flex-1 text-sm">
                  {table.getFilteredSelectedRowModel().rows.length} of{" "}
                  {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    Next
                  </Button>
                </div>
              </div>
      </div>
    </div>
  );
}

export default Versionamento;