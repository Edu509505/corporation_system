import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const url = import.meta.env.VITE_API_URL;

function VisualizarContrato() {
  const { id } = useParams<{ id: string }>();

  const { data: dadosCliente } = useQuery({
    queryKey: ["cliente"],
    queryFn: async () => {
      const response = await fetch(`${url}/contrato/${id}`);
      if (!response.ok) throw new Error("Cliente não encontrato");
      const data = await response.json();
      console.log(data);
      return data;
    },
  });

  return (
    <div className="w-full flex flex-col gap-3 p-4">
      <section>OI</section>
      <section>OI</section>
      <section>OI</section>
    </div>
  );
}

export default VisualizarContrato;
