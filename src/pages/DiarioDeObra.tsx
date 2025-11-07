// import { useQuery } from '@tanstack/react-query';
// import { fetchDiarioDeObraPorProposta } from '../services/diarioDeObraService';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CirclePlus } from 'lucide-react';
import TabelaDiariosDeObras from '@/components/diarioDeObra/TabelaDiarioDeObra'


export default function ListaDeDiarios() {

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
  );
}
