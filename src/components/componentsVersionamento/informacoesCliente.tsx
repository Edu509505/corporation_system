import { cnpj } from "cpf-cnpj-validator";

interface InfoClientesProps {
  nomeDaProposta: string;
  createdAt: string;
  valorProposta: number;
  cliente: string;
  cnpjCliente: string;
}

function InfoClientes({
  nomeDaProposta,
  valorProposta,
  createdAt,
  cliente,
  cnpjCliente,
}: InfoClientesProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <section>
        <h1 className="font-bold text-2xl">Versionamento de Proposta</h1>
        <h1>Nome da Proposta: {nomeDaProposta}</h1>
        <h1>
          Valor da Proposta:{" "}
          {Intl.NumberFormat("PT-BR", {
            style: "currency",
            currency: "BRL",
          }).format(valorProposta / 100)}
        </h1>
        <h1>Data: {createdAt.split("T")[0].split("-").reverse().join("/")}</h1>
        <h1>Cliente: {cliente}</h1>
        <h1>CNPJ: {cnpj.format(cnpjCliente)}</h1>
      </section>
    </div>
  );
}

export default InfoClientes;
