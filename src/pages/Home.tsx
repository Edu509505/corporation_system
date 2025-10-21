import PropostasFechadas from "@/components/cardsHome/PropostasFechadas";
import Grafico from "@/components/grafico/Grafico";

function Home() {
  return (
    <>
      <div className="flex flex-col bg-gray-50 h-full p-3 gap-3">
        <PropostasFechadas />
        <Grafico />
      </div>
    </>
  );
}

export default Home;
