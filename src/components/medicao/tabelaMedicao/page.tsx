import { useQuery } from "@tanstack/react-query";
import { columns, type Medicao } from "./columns";
import { DataTableMedicao } from "./dataTableMedicao";
const url = import.meta.env.VITE_API_URL;

export default function PageTableMedicao() {
  const { data: medicao } = useQuery({
    queryKey: ["medicao"],
    queryFn: async () => {
      const response = await fetch(`${url}/getMedicoes`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Proposta não encontrada");
      const data = await response.json();
      return data as Medicao[];
    },
  });

  return (
    <div className="container mx-auto">
      <DataTableMedicao columns={columns} data={medicao ?? []} />
    </div>
  );
}
