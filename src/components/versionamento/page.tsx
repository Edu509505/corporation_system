import { useQuery } from "@tanstack/react-query";
import { columns, type Propostas } from "./columns";
import { DataTable } from "./data-table";
import React from "react";
import type { ColumnFilter } from "@tanstack/react-table";
const url = import.meta.env.VITE_API_URL;
function getData(): Propostas[] {
  // Fetch data from your API here.
  const { data: propostas } = useQuery({
    queryKey: ["propostas"],
    queryFn: async () => {
      const response = await fetch(`${url}/propostas/`);
      if (!response.ok) throw new Error("Propostas não encontradas");
      const data = await response.json();
      return data as Propostas[];
    },
  });
  return propostas ? propostas : [];
}

export default function TabelaPropostas() {
  const data = getData();
    const [columnFilters, setColumnFilters] = React.useState<ColumnFilter[]>([]);

  return (
    <div className="container mx-auto">
      <DataTable 
        columns={columns} 
        data={data} 
        columnFilters={columnFilters} 
        setColumnFilters={setColumnFilters} 
        DadosValorVazio="Nenhuma proposta encontrada" 
      />
    </div>
  );
}
