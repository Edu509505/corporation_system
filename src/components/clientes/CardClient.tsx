import { cnpj } from "cpf-cnpj-validator";
import { CircleCheck, CircleX, Edit } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

interface CardClientProps {
  id: number;
  cliente: string;
  cnpjCliente: string;
  local: string;
  status: "ATIVO" | "INATIVO";
  path: string;
}

function CardClient({
  id,
  cliente,
  cnpjCliente,
  local,
  status,
  path,
}: CardClientProps) {
  return (
    <div>
      <div
        key={id}
        className="w-3xs h-96 flex flex-col justify-between rounded-2xl border-[1px] p-6 bg-white gap-3 "
      >
        <section className="flex flex-col items-center justify-between w-full gap-2">
          {status === "ATIVO" ? (
            <div className="w-[8rem] h-[8rem] border-4 flex justify-center items-center border-ring rounded-full text-center p-3">
              {!path ? (
                <h1 className="text-5xl ">
                  {
                    cliente
                      ?.split(" ")
                      .slice(0, 2)
                      .map((palavra) => palavra[0])
                      .join("")
                      .toUpperCase()

                    //Essa função pega o nome do cliente, elimina os espaços dividindo em 2 textos, depois pega a primeira letra de cada um e no final junta
                  }
                </h1>
              ) : (
                <img
                  src={`https://logo.clearbit.com/${path}`}
                  className="w-full h-full rounded-4xl"
                />
              )}
            </div>
          ) : status === "INATIVO" ? (
            <div className="w-[8rem] h-[8rem] border-4 flex justify-center items-center border-destructive rounded-full text-center">
              <h1 className="text-5xl ">
                {!path ? (
                  <h1 className="text-5xl ">
                    {
                      cliente
                        ?.split(" ")
                        .slice(0, 2)
                        .map((palavra) => palavra[0])
                        .join("")
                        .toUpperCase()

                      //Essa função pega o nome do cliente, elimina os espaços dividindo em 2 textos, depois pega a primeira letra de cada um e no final junta
                    }
                  </h1>
                ) : (
                  <img
                    src={`https://logo.clearbit.com/${path}`}
                    className="w-full h-full rounded-4xl"
                  />
                )}
              </h1>
            </div>
          ) : (
            ""
          )}
          <div className="w-full flex flex-col gap-2">
            <p>
              <strong>Cliente:</strong> {cliente}
            </p>
            <p>
              <strong>CNPJ:</strong> {cnpj.format(cnpjCliente)}
            </p>
            <p>
              <strong>Local:</strong> {local}
            </p>
            {status === "ATIVO" ? (
              <p className="flex itens-center gap-2 font-bold text-ring">
                <CircleCheck /> {status}
              </p>
            ) : status === "INATIVO" ? (
              <p className="flex itens-center gap-2 font-bold text-destructive">
                <CircleX /> {status}
              </p>
            ) : (
              ""
            )}
          </div>
        </section>
        <div className="w-full flex justify-end">
          <Link to={`/clientes/${id}`}>
            <Button
              variant="outline"
              className="flex itens-center gap-2 font-bold cursor-pointer"
            >
              <Edit /> Editar
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CardClient;
