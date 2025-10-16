import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import z from "zod";

const url = import.meta.env.VITE_API_URL;

interface Propostas {
    id: number;
    idCliente: number;
    nomeDaProposta: string;
    descricao: string
}

interface formularioDiarioDeObra {
    idProposta: number;
    idContrato: number;
    dataDia: string;
}

const validaSchemaDiarioDeObra = z
    .object({
        idProposta: z.string().min(1, 'Selecione pelo menos 1'),
        idContrato: z.string().min(1, 'Selecione pelo menos 1'),
        dataDia: z.string().min(3)
    })
    .refine(
        (data) =>
            (data.idProposta && !data.idContrato) ||
            (!data.idProposta && data.idContrato),
    );

export default function CriarDiarioDeObra() {
    const { data: propostasAprovadas } = useQuery({
        queryKey: ["propostasAprovadas",],
        queryFn: async () => {
            const response = await fetch(
                `${url}/propostasAprovadas`
            );
            if (!response.ok) throw new Error("Propostas aprovadas não encontradas");
            const data = await response.json();
            return data as Propostas[];
        },
    });

    console.log('propostasAprovadas', propostasAprovadas);

    const form = useForm<z.infer<typeof validaSchemaDiarioDeObra>>({
        resolver: zodResolver(validaSchemaDiarioDeObra),
        defaultValues: {
            idProposta: "",
            idContrato: "",
            dataDia: "",
        },
    });

    function onSubmit(values: z.infer<typeof validaSchemaDiarioDeObra>) {
        console.log(values)
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="idProposta"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Proposta</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger className="w-[300px]">
                                        <SelectValue placeholder="Selecionar proposta" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="w-[300px]">
                                    <SelectGroup>
                                        <SelectLabel>Proposta</SelectLabel>
                                        {propostasAprovadas?.map((propostas) => (
                                            <SelectItem
                                                key={propostas.id}
                                                value={propostas.id.toString()}
                                            >
                                                {propostas.nomeDaProposta}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                                <FormMessage />
                            </Select>
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}