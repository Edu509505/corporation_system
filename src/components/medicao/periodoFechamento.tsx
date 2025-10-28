import { useSuspenseQuery } from "@tanstack/react-query";

const url = import.meta.env.VITE_API_URL;

interface PeriodoFechamentoProps {
  dataInicial: Date,
  dataFinal: Date
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

function periodoFechamento({dataInicial, dataFinal}: PeriodoFechamentoProps) {

    const { data: periodo } = useSuspenseQuery({
      queryKey: ["getPeriodoDeObra"],
      queryFn: async () => {
        const response = await fetch(`${url}/diarioDeObraPeriodo/${dataInicial}/${dataFinal}`);
        if (!response.ok) throw new Error("Propostas não encontradas");
        const data = await response.json();
        return data as DiarioDeObra [];
      },
    });
  
    console.log("Periodo", periodo);

  return(
    <>
      <h1>{periodo.map((dados) => dados.itensDiarioDeObra.descricao)}</h1>
    </>
  )
}

export default periodoFechamento;
