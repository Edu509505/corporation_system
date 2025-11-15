import { useQuery } from "@tanstack/react-query";
import { columns, type DiarioDeObra } from "./columns";
import { DataTableDiarioDeObra } from "./dataTableDiarioDeObra";
const url = import.meta.env.VITE_API_URL;

export default function PageTableDiarioDeObras() {
  const { data: DiarioDeObras } = useQuery({
    queryKey: ["DiarioDeObras"],
    queryFn: async () => {
      const response = await fetch(`${url}/diarioDeObras`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("DiarioDeObra não encontrada");
      const data = await response.json();
      return data as DiarioDeObra[];
    },
  });

  console.log("Page", DiarioDeObras)

  return (
    <div className="container mx-auto">
      <DataTableDiarioDeObra columns={columns} data={DiarioDeObras ?? []} />
    </div>
  );
}
