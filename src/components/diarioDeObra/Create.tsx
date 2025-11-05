import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// Select já é importado no topo do arquivo (se necessário ajuste), evitando duplicação
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Calendar } from "@/components/ui/calendar"
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import z from "zod";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDownIcon, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

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
        dataDia: z.date(),
        itensDoDia: z.array(z.object({
            descricao: z.string().min(2, "Nome obrigatório"),
            idQuantitativa: z.string().min(1, "Selecione a quantitativa"),
            quantidade: z.number().min(1, "Quantidade obrigatória"),
        }))
    })
export default function CriarDiarioDeObra() {

    const navigate = useNavigate();
    const [toast, setToast] = React.useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const { data: propostasAprovadas } = useQuery({
        queryKey: ["propostasAprovadas",],
        queryFn: async () => {
            const response = await fetch(
                `${url}/propostasAprovadas`,{
                    method: "GET",
                    credentials: "include"
                }
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
            dataDia: new Date(),
            itensDoDia: []
        },
    });

    const dataDia = form.watch('dataDia');
    const idPropostaSelecionada = form.watch('idProposta');

    const { data: quantitativasForProposta } = useQuery({
        queryKey: ['quantitativas', idPropostaSelecionada],
        queryFn: async () => {
            if (!idPropostaSelecionada) return [] as any[];
            const response = await fetch(`${url}/quantitativa/${idPropostaSelecionada}`, {
                method: "GET",
                credentials: "include"
            });
            if (!response.ok) return [] as any[];
            const data = await response.json();
            return data as { id: number; descricao: string }[];
        }
    });

    const criarDiarioMutation = useMutation({
        mutationKey: ['criarDiario'],
        mutationFn: async (payload: any) => {
            const response = await fetch(`${url}/diarioDeObra`, {
                method: 'POST',
                credentials: "include",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || 'Erro ao criar diário');
            }
            return response.json();
        }
    });

    async function onSubmit(values: z.infer<typeof validaSchemaDiarioDeObra>) {
        try {
            const payload = {
                idProposta: Number(values.idProposta),
                dataDia: values.dataDia instanceof Date ? values.dataDia.toISOString() : values.dataDia,
                itensDoDia: values.itensDoDia.map((it) => ({
                    descricao: it.descricao,
                    idQuantitativa: Number(it.idQuantitativa),
                    quantidade: Number(it.quantidade),
                })),
            };

            await criarDiarioMutation.mutateAsync(payload);
            form.reset({ idProposta: '', dataDia: new Date(), itensDoDia: [] });
            setToast({ message: 'Diário criado com sucesso', type: 'success' });
            setTimeout(() => setToast(null), 3000);
            // redirecionar para lista de diários
            navigate('/diariodeobra');
        } catch (err: any) {
            console.error('Erro ao criar diário:', err);
            alert('Erro ao criar diário: ' + (err?.message || ''));
        }
    }

    const [open, setOpen] = React.useState(false);

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "itensDoDia",
    });

    console.log('fields', fields);

    return (
        <div className="flex flex-col p-4 gap-3">
            {toast ? (
                <div className={`p-3 rounded ${toast.type === 'success' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                    {toast.message}
                </div>
            ) : null}
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
                                {dataDia ? dataDia.toLocaleDateString() : "Selecione a data"}
                                <ChevronDownIcon />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={dataDia}
                                captionLayout="dropdown"
                                onSelect={(date) => {
                                    form.setValue('dataDia', date!)
                                    setOpen(false)
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                    <div className="flex gap-3 items-center border-1 border-gray-500 rounded-2xl p-4 scroll-auto">
                        <div className="space-y-4">
                            <div className="flex flex-col gap-4 justify-center items-center">
                                {fields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="flex items-start gap-1"
                                    >
                                        <FormField
                                            control={form.control}
                                            name={`itensDoDia.${index}.descricao`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Descrição
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Descricao do item"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`itensDoDia.${index}.idQuantitativa`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Quantitativa</FormLabel>
                                                    <FormControl>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="w-[200px]">
                                                                    <SelectValue placeholder="Selecione a quantitativa" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent className="w-[200px]">
                                                                <SelectGroup>
                                                                    <SelectLabel>Quantitativas</SelectLabel>
                                                                    {quantitativasForProposta?.map((q) => (
                                                                        <SelectItem key={q.id} value={q.id.toString()}>{q.descricao}</SelectItem>
                                                                    ))}
                                                                </SelectGroup>
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`itensDoDia.${index}.quantidade`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Quantidade
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="Quantidade"
                                                            value={field.value}
                                                            onChange={e => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                remove(index)
                                            }
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <Button
                                type="button"
                                onClick={() => {
                                    append({
                                        descricao: "",
                                        idQuantitativa: "",
                                        quantidade: 0,
                                    });
                                }
                                }
                            >
                                Adicionar item
                            </Button>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button type="submit" disabled={criarDiarioMutation.status === 'pending'}>
                            {criarDiarioMutation.status === 'pending' ? 'Criando...' : 'Criar'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}