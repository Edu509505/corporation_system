import { useQuery } from "@tanstack/react-query";
import { cnpj } from "cpf-cnpj-validator";

const url = import.meta.env.VITE_API_URL;

function InformacoesClientesContrato({ id }: { id: number | undefined }) {
  const { data: dadosCliente } = useQuery({
    queryKey: ["cliente"],
    queryFn: async () => {
      const response = await fetch(`${url}/cliente/${id?.toString()}`);
      if (!response.ok) throw new Error("Cliente não encontrato");
      const data = await response.json();
      console.log(data);
      return data;
    },
  });

  console.log("dados Clientes", dadosCliente);

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
