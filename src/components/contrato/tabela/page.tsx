import { useQuery } from "@tanstack/react-query";
import { columns, type Contrato } from "./columns";
import { DataTableContratos} from "./dataTableContrato";
const url = import.meta.env.VITE_API_URL;

export default function PageTableContratos() {
  const {
      //isPending: propostaLoading,
      //error: propostaError,
      data: contratosData,
    } = useQuery({
      queryKey: ["contratos"],
      queryFn: async () => {
        const response = await fetch(`${url}/contratos/`, {
          method: "GET",
          credentials: "include"
        });
        if (!response.ok) throw new Error("Proposta não encontrada");
        const data = await response.json();
        return data as Contrato[];
      },
    });

  return (
    <div className="container mx-auto">
      <DataTableContratos columns={columns} data={contratosData ?? []} />
    </div>
  );
}
