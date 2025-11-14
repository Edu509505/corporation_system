import { CardFaturamento } from "@/components/cardsHome/CardFaturamento";
import { CardComparacaoPropostas } from "@/components/cardsHome/ComparacaoProposta";
import { CardPropostasEmAnalise } from "@/components/cardsHome/PropostasEmAnalise";
import Grafico from "@/components/graficos/GraficoM2";

function Home() {
  return (
    <main className="min-h-screen bg-background p-4">
      <h1 className="text-xl font-semibold text-gray-800 mb-4">Painel de Propostas</h1>

      <div className="flex flex-wrap gap-x-4 gap-y-6">
        <CardComparacaoPropostas />
        {/* <CardPropostaEmAndamento /> */}
        <CardPropostasEmAnalise/>
        <CardFaturamento/>
        {/* Adicione mais cards aqui */}
      </div>

      <div className="mt-6">
        <Grafico />
      </div>
    </main>
  );
}


export default Home;
