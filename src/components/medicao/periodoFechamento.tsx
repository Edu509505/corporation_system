// const url = import.meta.env.VITE_API_URL;

// interface PeriodoFechamentoProps {
//   dataInicial: Date,
//   dataFinal: Date
// }

// function periodoFechamento({dataInicial, dataFinal}: PeriodoFechamentoProps) {

//     const { data: periodo } = useSuspenseQuery({
//       queryKey: ["getPeriodoDeObra"],
//       queryFn: async () => {
//         const response = await fetch(`${url}/usuarios`);
//         if (!response.ok) throw new Error("Propostas não encontradas");
//         const data = await response.json();
//         return data;
//       },
//     });
  
//     console.log("Periodo", periodo);

//   return;
// }

// export default periodoFechamento;
