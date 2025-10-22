// import { useQuery } from '@tanstack/react-query';
// import { fetchDiarioDeObraPorProposta } from '../services/diarioDeObraService';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CirclePlus } from 'lucide-react';

// export default function DiarioDeObra() {
//   const { idProposta } = useParams<{ idProposta: string }>();

//   const { data, isLoading, error } = useQuery({
//     queryKey: ['diarioDeObra', idProposta],
//     queryFn: () => fetchDiarioDeObraPorProposta(idProposta!),
//     enabled: !!idProposta,
//   });

//   return (
//     <div>
//       <Link to="/criarDiarioDeObra">
//         <Button variant="default" className="cursor-pointer">
//           <CirclePlus />
//           Novo Diário de Obra
//         </Button>
//       </Link>

//       {isLoading && <p>Carregando...</p>}
//       {error && <p>Erro ao carregar dados.</p>}

//       {data && (
//         <div className="mt-4">
//           {data.map((diario: any) => (
//             <div key={diario.id} className="border p-4 mb-2 rounded">
//               <h2 className="font-bold">Data: {diario.dataDia}</h2>
//               <ul>
//                 {diario.itensDoDia.map((item: any) => (
//                   <li key={item.id}>
//                     {item.descricao} - {item.quantitativa?.descricao} -{item.quantidade} 
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
import TabelaDiariosDeObras from '@/components/diarioDeObra/tabelaDiarioDeObra';



export default function ListaDeDiarios() {

  // const { data, isLoading, error } = useQuery({
  //   queryKey: ['todosDiariosDeObra'],
  //   queryFn: fetchTodosDiariosDeObra,
  // });
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/criarDiarioDeObra"); // Navigates to the /dashboard route
  };

  return (
    <>
      <main className="flex flex-col items-center justify-start h-screen p-2 pt-5 pb-10 gap-3 bg-gray-50">
        <article className="items-start w-full ">
          <h1 className="font-bold text-3xl">Diario De Obra</h1>
          {/* <h2>Metragem de contratos e trabalhos avulso</h2> */}
        </article>
        <article className="w-full">
          <div className="flex items-center justify-end w-full">
            <Button onClick={handleClick} className="cursor-pointer">
              <CirclePlus />
              Criar Proposta
            </Button>
          </div>
          <TabelaDiariosDeObras />
        </article>
      </main>
    </>
    // {/* 
    //       {isLoading && <p>Carregando...</p>}
    //       {error && <p>Erro ao carregar dados.</p>}

    //       {data?.map((diario: any) => (
    //         <div key={diario.id} className="border p-4 mb-4 rounded">
    //           <h2 className="font-semibold">
    //             Data: {dayjs(diario.dataDia).format('DD/MM/YYYY')}
    //           </h2>

    //           <ul>
    //             {diario.itensDoDia.map((item: any) => (
    //               <li key={item.id}>
    //                 {item.descricao} - {item.quantitativa?.descricao} - {item.quantidade}
    //               </li>
    //             ))}
    //           </ul>
    //         </div>
    //       ))} */
    //      }
  );
}
