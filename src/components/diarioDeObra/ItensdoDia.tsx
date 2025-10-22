import { useSuspenseQuery } from "@tanstack/react-query";
import type { ColumnFilter } from "@tanstack/react-table";
import React from "react";

interface ItensDoDiaProps {
    idProposta: number;
}

interface ItensDoDia {
    
}

const url = import.meta.env.VITE_API_URL;

function ItensDoDiaList({ idProposta } : ItensDoDiaProps ){
    const [columnFilters, setColumnFilters] = React.useState<ColumnFilter[]>([]);

    const { data: itensDoDia } = useSuspenseQuery({
        queryKey: ["itensDoDia", idProposta],
        queryFn: async () => {
            const response = await fetch(`${url}/diario-de-obra/proposta/${idProposta}`);
            if (!response.ok) throw new Error('Erro ao buscar diários de obra');
            const data = await response.json();
            return data as ItensDoDia[];
        }
    });


    return (
        <></>
    )
}