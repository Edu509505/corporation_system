import { Button } from "@/components/ui/button";
// import { useQuery } from "@tanstack/react-query";
import { CirclePlus } from "lucide-react";
import { Link} from "react-router-dom";


const url = import.meta.env.VITE_API_URL;

export default function DiarioDeObra (){

    // const { data: clientes } = useQuery<Cliente[]>({
    //     queryKey: ['clientes'],
    //     queryFn: async () => {
    //         const response = await fetch(`${url}/clientes`);
    //         if (!response.ok) throw new Error('Failed to fetch clientes');
    //         return response.json();
    //     }
    // });

    


    return(
       <div>
        <Link to="/criarDiarioDeObra">
          <Button variant="default" className="cursor-pointer">
            <CirclePlus />
            Novo Diario de Obra
          </Button>
        </Link>
      </div>
    )
}