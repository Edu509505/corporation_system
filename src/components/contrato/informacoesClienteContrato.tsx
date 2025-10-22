import { useQuery } from "@tanstack/react-query";
import { cnpj } from "cpf-cnpj-validator";

const url = import.meta.env.VITE_API_URL;

interface InformacoesClientesContratoProps {
  id: number;
}

function InformacoesClientesContrato({ id }: InformacoesClientesContratoProps) {
  const { data: dadosCliente } = useQuery({
    queryKey: ["cliente", id],
    queryFn: async () => {
      const response = await fetch(`${url}/cliente/${id}`);
      if (!response.ok) throw new Error("Cliente não encontrato");
      const data = await response.json();
      return data;
    },
  });

  return (
    <div className="flex items-start justify-between gap-4">
      <section>
        <h1>Cliente: {dadosCliente?.cliente}</h1>
        <h1>CNPJ: {cnpj.format(dadosCliente?.cnpj as string)}</h1>
      </section>
    </div>
  );
}

export default InformacoesClientesContrato;
