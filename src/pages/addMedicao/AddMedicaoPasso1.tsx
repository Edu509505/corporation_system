import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

function AddMedicao() {

    const empresas = [
        {id: 1, empresa: 'Ecoporto', cnpj: '00.000.000/0000-00'},
        {id: 2, empresa: 'Ecopátio', cnpj: '00.000.000/0000-00'},
        {id: 3, empresa: 'RGLOG', cnpj: '00.000.000/0000-00'},
        {id: 4, empresa: 'Rumo', cnpj: '00.000.000/0000-00'}
    ]

    const contratos = [
        {id: 1, contrato:'00037/2025', nome: 'Limpeza De Canaletas'},
        {id: 2, contrato:'00038/2025', nome: 'Pavimentação'},
        {id: 3, contrato:'00087/2025', nome: 'Pavimentação'}
    ]

    return (
        <div className="bg-gray-50 h-full w-full">
            <h1 className="font-bold text-3xl text-center">Criar Nova Medição</h1>
            <div className="w-full h-32 flex justify-center items-center gap-1">
                <div className="rounded-full bg-ring size-15 flex justify-center items-center">
                    <h1 className="font-bold text-center text-2xl text-white">1</h1>
                </div>
                <div className="w-20 h-1 bg-ring"></div>
                <div className="rounded-full border-solid border-2 border-ring size-15 flex justify-center items-center">
                    <h1 className="font-bold text-center text-2xl text-gray-400">2</h1>
                </div>
                <div className="w-20 h-1 bg-ring"></div>
                <div className="rounded-full border-solid border-2 border-ring size-15 flex justify-center items-center">
                    <h1 className="font-bold text-center text-2xl text-gray-400">3</h1>
                </div>
                <div className="w-20 h-1 bg-ring"></div>
                <div className="rounded-full border-solid border-2 border-ring size-15 flex justify-center items-center">
                    <h1 className="font-bold text-center text-2xl text-gray-400">4</h1>
                </div>
            </div>
            <div className="w-full h-30 flex flex-col p-1 gap-2 items-start justify-center border-b-1 border-solid border-gray-500">
                <h1 className="text-3xl">Selecione a Empresa</h1>
                <Select>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Selecione o contrato"/>
                    </SelectTrigger>
                    <SelectContent className="w-[200px]">
                        <SelectGroup>
                            <SelectLabel>Cliente</SelectLabel>
                            {empresas.map((contratos) => (
                            <SelectItem key={contratos.id} value={contratos.empresa}>
                                {contratos.empresa}
                            </SelectItem>
                        ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <h1 className="text-3xl">Selecione o contrato referente a essa medição</h1>
            </div>
        </div>
    )
}

export default AddMedicao;