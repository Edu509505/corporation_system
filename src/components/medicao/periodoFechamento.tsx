import { useSuspenseQuery } from "@tanstack/react-query";
import { format } from 'date-fns'

const url = import.meta.env.VITE_API_URL;

interface PeriodoFechamentoProps {
  dataInicial: Date | null,
  dataFinal: Date | null,
  idProposta: string | undefined
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

function PeriodoFechamento({dataInicial, dataFinal, idProposta}: PeriodoFechamentoProps) {

    const { data: periodo } = useSuspenseQuery({
      queryKey: ["getPeriodoDeObra", dataInicial || dataFinal],
      queryFn: async () => {
        const response = await fetch(`${url}/diarioDeObraPeriodo/${format(new Date(dataInicial as Date), "yyyy-MM-dd")}/${format(new Date(dataFinal as Date), "yyyy-MM-dd")}/proposta/${idProposta}`);
        if (!response.ok) throw new Error("Propostas não encontradas");
        const data = await response.json();
        return data as DiarioDeObra [];
      },
    });
  
    console.log("Periodo", periodo);

  return(
    <section className="h-full bg-amber-200">
      <h1>{periodo.length}</h1>
    </section>
  )
}

export default PeriodoFechamento;
