import { useQuery } from "@tanstack/react-query";
import { columns, type Proposta } from "./columns";
import { DataTableProposta } from "./dataTablePropostas";
const url = import.meta.env.VITE_API_URL;

export default function PageTablePropostas() {
  const { data: propostas } = useQuery({
    queryKey: ["propostas"],
    queryFn: async () => {
      const response = await fetch(`${url}/propostas`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Proposta não encontrada");
      const data = await response.json();
      return data as Proposta[];
    },
  });

  return (
    <div className="container mx-auto">
      <DataTableProposta columns={columns} data={propostas ?? []} />
    </div>
  );
}
