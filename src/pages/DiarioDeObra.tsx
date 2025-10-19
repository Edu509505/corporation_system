import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { id } from "date-fns/locale";
import { CirclePlus } from "lucide-react";
import { Link} from "react-router-dom";


const url = import.meta.env.VITE_API_URL;

export default function DiarioDeObra (){

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