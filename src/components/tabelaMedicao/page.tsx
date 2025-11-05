import { colunaVersionamento, type Medicoes } from "./columns";
import { DataTableMedicao } from "./dataTableMedicao";
import { useQuery } from "@tanstack/react-query";
const url = import.meta.env.VITE_API_URL;

export default function TabelaMedicao() {
  const { data: medicoes } = useQuery({
    queryKey: ["medicoes"],
    queryFn: async () => {
      const response = await fetch(`${url}/getMedicoes`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Medições não encontradas");
      const data = await response.json();
      return data as Medicoes[];
    },
  });

  return (
    <div className="container mx-auto">
      <DataTableMedicao
        columns={colunaVersionamento}
        data={medicoes ?? []}
        DadosValorVazio="Nenhum pagamento encontrado"
      />
    </div>
  );
}
