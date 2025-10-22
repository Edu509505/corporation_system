import { useSuspenseQuery } from "@tanstack/react-query"

const url = import.meta.env.VITE_API_URL;

interface Proposta {
  id: number;
  idCliente: number;
  nomeDaProposta: string;
  descricao: string;
  valorProposta: string;
  updateAt: string;
}

function PropostasFechadas() {

  const { data: propostasAprovadas } = useSuspenseQuery({
    queryKey: ["propostasAprovadas"],
    queryFn: async () => {
      const response = await fetch(`${url}/propostasAprovadas`);
      if (!response.ok) throw new Error("erro ao encontrar os versionamentos aprovados");
      const data = await response.json();
      return data as Proposta[];
    }
  })

  console.log(propostasAprovadas)

  return (
    <>
      <div className="w-80 rounded-2xl bg-white border-1 items-center border-gray-200 flex p-3">
        <h1 className="text-6xl font-bold ml-4 mr-7">
          {propostasAprovadas.length}
        </h1>

        <div className="flex flex-col justify-center items-start gap-3">
          <h1 className="text-2xl font-bold">Propostas</h1>
          Até o momento temos
          {propostasAprovadas.length === 0 || null ?
            (<>Até o momento nenhuma Proposta Aprovada</>)
            : propostasAprovadas.length === 1 ?
              (<>Proposta Aprovada</>) : (<>Propostas Aprovadas</>)}

        </div>
      </div>
    </>
  )
}

export default PropostasFechadas