import { CircleCheckBig, CircleX, TimerIcon } from "lucide-react";
import { Badge } from "../ui/badge";

interface StatusEstilizadoProps {
  status: string;
}

function StatusDeAprovacao({ status }: StatusEstilizadoProps) {
  return (
    <>
      {status === "EM_ANALISE" ? (
        <>
          <Badge className="border-1 border-chart-1 text-chart-1 bg-amber-50">
            <TimerIcon className="size-5" />
            Em Análise
          </Badge>
        </>
      ) : status === "REPROVADA" ? (
        <>
          <Badge className="border-1 border-destructive text-destructive bg-red-50">
            <CircleX className="size-5" /> Reprovada
          </Badge>
        </>
      ) : status === "APROVADA" ? (
        <>
          <Badge className="border-1 border-ring text-ring bg-green-50">
            <CircleCheckBig className="size-5" /> Aprovada
          </Badge>
        </>
      ) : (
        ""
      )}
    </>
  );
}

export default StatusDeAprovacao;
