import { CircleX } from "lucide-react";

function NoPage() {
  return (
    <div className="w-full h-screen flex flex-row items-center justify-around">

      <div className="flex flex-col items-center justify-center gap-3 text-gray-500">
        <h1 className="text-3xl">Erro 404</h1>
        <h2>Essa página não existe</h2>
        <CircleX className="size-20" />
        <h1>Ops! Parece que você tentou navegar em uma página inexistente</h1>

      </div>

    </div>
  );
}

export default NoPage;
