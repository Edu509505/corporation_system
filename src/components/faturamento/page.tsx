import { useQuery } from "@tanstack/react-query";
import { columns, type Faturamento } from "./columns";
import { DataTableFaturamento } from "./dataTableFaturamento";
const url = import.meta.env.VITE_API_URL;

export default function PageTableFaturamento() {
  const { data: faturamento } = useQuery({
    queryKey: ["faturamento"],
    queryFn: async () => {
      const response = await fetch(`${url}/getTodosOsFaturamentos`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Proposta não encontrada");
      const data = await response.json();
      return data as Faturamento[];
    },
  });

  return (
    <div className="container mx-auto">
      <DataTableFaturamento columns={columns} data={faturamento ?? []} />
    </div>
  );
}
