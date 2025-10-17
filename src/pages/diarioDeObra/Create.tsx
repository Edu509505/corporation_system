import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Calendar } from "@/components/ui/calendar"
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDownIcon} from "lucide-react";

const url = import.meta.env.VITE_API_URL;

interface Propostas {
    id: number;
    idCliente: number;
    nomeDaProposta: string;
    descricao: string
}

// interface formularioDiarioDeObra {
//     idProposta: number;
//     dataDia: string;
// }

// interface ItensDoDia {
//     itens: {
//         idDiarioDeObra: number;
//         descricao: string;
//         itemQuantitativa: string;
//         quantidade: number;
//     }[]
// }

 
const validaSchemaDiarioDeObra = z
    .object({
        idProposta: z.string().min(1, 'Selecione pelo menos 1'),
        dataDia: z.string().min(3)
    })
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
            dataDia: "",
        },
    });

    function onSubmit(values: z.infer<typeof validaSchemaDiarioDeObra>) {
        console.log(values)
    }

    const [open, setOpen] = React.useState(false)
    const [date, setDate] = React.useState<Date | undefined>(undefined)

    // const itemSchema = z.object({
    //     idDiarioDeObra: z.number(),
    //     descricao: z.string().min(2, "Nome obrigatório"),
    //     itemQuantitativa: z.string().min(1, "Unidade obrigatória"),
    //     quantidade: z.string(),
    //   });
    
    //   const formSchemaitensArray = z.object({
    //     itens: z.array(itemSchema).min(1, "Adicione pelo menos um item"),
    //   });

    return (
        <div className="flex flex-col p-4 gap-3">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
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
                    <Label htmlFor="date" className="">
                        Data
                    </Label>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                id="date"
                                className="w-48 justify-between font-normal"
                            >
                                {date ? date.toLocaleDateString() : "Selecione a data"}
                                <ChevronDownIcon />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={date}
                                captionLayout="dropdown"
                                onSelect={(date) => {
                                    setDate(date)
                                    setOpen(false)
                                }}
                            />
                        </PopoverContent>
                    </Popover>

                   
                     {/* <Button type="submit">Submit</Button> */}
                </form>
            </Form>
        </div>
    )
}