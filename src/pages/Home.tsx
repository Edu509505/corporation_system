import { CardFaturamento } from "@/components/cardsHome/CardFaturamento";
import { CardComparacaoPropostas } from "@/components/cardsHome/ComparacaoProposta";
import { CardPropostasEmAnalise } from "@/components/cardsHome/PropostasEmAnalise";
import { CardPropostaEmAndamento } from "@/components/cardsHome/PropostasFechadas";
import Grafico from "@/components/grafico/Grafico";

function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-xl font-semibold text-gray-800 mb-4">📈 Painel de Propostas</h1>

      <div className="flex flex-wrap gap-x-4 gap-y-6">
        {/* <CardPropostaEmAndamento /> */}
        <CardComparacaoPropostas />
        <CardFaturamento/>
        {/* <CardPropostasEmAnalise/> */}
        {/* Adicione mais cards aqui */}
      </div>

      <div className="mt-6">
        <Grafico />
      </div>
    </main>
  );
}


export default Home;
