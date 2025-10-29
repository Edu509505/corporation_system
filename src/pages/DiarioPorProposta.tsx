import { TabelaDiariosDeObrasPorProposta } from "@/components/diarioDeObra/TabelaDiarioDeObraPorProposta";

export default function MostrarDiarioDeObraPorProposta() {
    return (
        <main className="flex flex-col items-center justify-start h-screen p-2 pt-5 pb-10 gap-3 bg-gray-50">
            <article className="items-start w-full ">
                <h1 className="font-bold text-3xl">Diario De Obra</h1>
                {/* <h2>Metragem de contratos e trabalhos avulso</h2> */}
            </article>
            <article className="w-full">
                <TabelaDiariosDeObrasPorProposta />
            </article>
        </main>
    )
}