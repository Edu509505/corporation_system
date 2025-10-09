import { CircleCheckBig, CircleX, TimerIcon } from "lucide-react";

interface StatusEstilizadoProps {
  status: string;
}

function StatusDeAprovacao({ status }: StatusEstilizadoProps) {
  return (
    <>
      {status === "EM_ANALISE" ? (
        <>
          <div className="flex items-center justify-center gap-3 h-7 text-chart-1 bg-amber-50 rounded-2xl">
            <TimerIcon className="size-5" />
            Em Análise
          </div>
        </>
      ) : status === "REPROVADA" ? (
        <>
          <div className="flex items-center justify-center gap-3 h-7 text-destructive bg-red-100 rounded-2xl">
            <CircleX className="size-5" /> Reprovada
          </div>
        </>
      ) : status === "APROVADA" ? (
        <>
          <div className="flex items-center justify-center gap-3 h-7 text-ring bg-green-100 rounded-2xl">
            <CircleCheckBig className="size-5" /> Aprovada
          </div>
        </>
      ) : (
        ""
      )}
    </>
  );
}

export default StatusDeAprovacao;
