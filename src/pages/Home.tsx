import PropostasFechadas from "@/components/cardsHome/PropostasFechadas";

function Home() {
  return (
    <>
      <div className="flex flex-col bg-gray-50 h-full p-3 gap-3">
        <PropostasFechadas />
      </div>
    </>
  );
}

export default Home;
