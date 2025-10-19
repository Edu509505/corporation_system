// import { useQuery } from '@tanstack/react-query';
// import { fetchDiarioDeObraPorProposta } from '../services/diarioDeObraService';
import { useParams, Link } from 'react-router-dom';
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
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';


const url = import.meta.env.VITE_API_URL;

export async function fetchTodosDiariosDeObra() {
  const response = await fetch(`${url}/diario-de-obra`);
  if (!response.ok) throw new Error('Erro ao buscar diários de obra');
  return response.json();
}

export default function ListaDeDiarios() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['todosDiariosDeObra'],
    queryFn: fetchTodosDiariosDeObra,
  });

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Todos os Diários de Obra</h1>

      <Link to="/criarDiarioDeObra">
        <Button variant="default" className="cursor-pointer">
          <CirclePlus />
          Novo Diário de Obra
        </Button>
      </Link>

      {isLoading && <p>Carregando...</p>}
      {error && <p>Erro ao carregar dados.</p>}

      {data?.map((diario: any) => (
        <div key={diario.id} className="border p-4 mb-4 rounded">
          <h2 className="font-semibold">
            Data: {dayjs(diario.dataDia).format('DD/MM/YYYY')}
          </h2>

          <ul>
            {diario.itensDoDia.map((item: any) => (
              <li key={item.id}>
                {item.descricao} - {item.quantitativa?.descricao} - {item.quantidade}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
