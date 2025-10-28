import { useSuspenseQuery } from "@tanstack/react-query";

const url = import.meta.env.VITE_API_URL;

interface PeriodoFechamentoProps {
  dataInicial: Date | null,
  dataFinal: Date | null
}

interface DiarioDeObra{
  id: Number,
  idProposta: Number,
  dataDia: Date
  itensDiarioDeObra: {
    id: Number,
    idDiarioDeObra: Number,
    descricao: string,
    quantidade: Number,
    idQuantitativa: Number
  }
}

function PeriodoFechamento({dataInicial, dataFinal}: PeriodoFechamentoProps) {

    const { data: periodo } = useSuspenseQuery({
      queryKey: ["getPeriodoDeObra", dataInicial || dataFinal],
      queryFn: async () => {
        const response = await fetch(`${url}/diarioDeObraPeriodo/${dataInicial}/${dataFinal}`);
        if (!response.ok) throw new Error("Propostas não encontradas");
        const data = await response.json();
        return data as DiarioDeObra [];
      },
    });
  
    console.log("Periodo", periodo);

  return(
    <section className="h-full bg-amber-200">
      <h1>{periodo.map((dados) => dados.itensDiarioDeObra.descricao)}</h1>
    </section>
  )
}

export default PeriodoFechamento;
