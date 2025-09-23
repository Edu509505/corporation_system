import type { ColumnDef } from "@tanstack/react-table";
import { CircleAlertIcon, CircleCheck, CircleX } from "lucide-react";

export type Payment = {
    id: string
    empresa: string
    situacao: 'Ativo' | 'Pendente' | 'Cancelado'
    emissao: string
    local: string
    valor: number
}


export type Propostas = {
    nomeDaProposta: string;
    descricao: string;
    createdAt: string;
    cliente:{
        cliente: string;
    };
}

export type Cliente = {
    cliente: string;
    cnpj: string;
    local: string;
    status: string;
    file: File | null;
}
export type Versionamento = {
  id: number;
  versao: number;
  idProposta: number;
  status: string;
  createdAt: string;
}

export const columns: ColumnDef<Payment>[] = [
    {
        accessorKey: 'id',
        header: 'Número',
    },
    {
        accessorKey: 'empresa',
        header: 'Empresa',
    },
    {
        accessorKey: 'situacao',
        header: () => <div className="text-center">Situação</div>,
        cell: ({ row }) => {

            let modos = null
            let color = ''

            if(row.getValue('situacao') === 'Ativo'){
                modos = <CircleCheck className="text-ring" />
                color = 'text-ring'
            }if (row.getValue('situacao') === 'Pendente'){
                modos = <CircleAlertIcon className="text-chart-1" />
                color = 'text-chart-1'
            }if(row.getValue('situacao') === 'Cancelado'){
                modos = <CircleX className="text-destructive" />
                color='text-destructive'
            }else{''} 

            return <div className="flex flex-col items-center justify-center">{modos}<h5 className={color}>{row.getValue('situacao')}</h5></div>
        }
    },
    {
        accessorKey: 'emissao',
        header: 'Emissão'
    },
    {
        accessorKey: 'local',
        header: 'Local',
    },
    {
        accessorKey: "valor",
        header: () => <div className="text-right">Valor</div>,
        cell: ({ row }) => {
            const valor = parseFloat(row.getValue("valor"))
            const formatted = new Intl.NumberFormat("PT-BR", {
                style: "currency",
                currency: "BRL",
            }).format(valor)

            return <div className="text-right font-medium">{formatted}</div>
        }
    },
]

export const colunaVersionamento: ColumnDef<Versionamento>[] =[
    {
        accessorKey: 'versao',
        header: 'Versão',
    },
    {
        accessorKey: 'status',
        header: () => <div className="text-center">Situação</div>,
        cell: ({ row }) => {

            let modos = null
            let color = ''

            if(row.getValue('status') === 'APROVADO'){
                modos = <CircleCheck className="text-ring" />
                color = 'text-ring'
            }if (row.getValue('status') === 'EM_ANALISE'){
                modos = <CircleAlertIcon className="text-chart-1" />
                color = 'text-chart-1'
            }if(row.getValue('status') === 'REPROVADO'){
                modos = <CircleX className="text-destructive" />
                color='text-destructive'
            }else{''} 

            return <div className="flex flex-col items-center justify-center">{modos}<h5 className={color}>{row.getValue('status')}</h5></div>
        }
    },
    {
        accessorKey: 'createdAt',
        header: 'Data',
        cell: ({row}) => {row.getValue.toString().split("T")[0].split("-").reverse().join("/")}
    }
]