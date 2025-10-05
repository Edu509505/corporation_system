import { cnpj } from "cpf-cnpj-validator";

interface Propostas {
  nomeDaProposta: string;
  createdAt: string;
  cliente: string;
  cnpjCliente: string;
}

function InfoClientes({
  nomeDaProposta,
  createdAt,
  cliente,
  cnpjCliente,
}: Propostas) {
  return (
    <div className="flex items-start justify-between gap-4">
      <section>
        <h1 className="font-bold text-2xl">Versionamento de Proposta</h1>
        <h1>Nome da Proposta: {nomeDaProposta}</h1>
        <h1>Data: {createdAt.split("T")[0].split("-").reverse().join("/")}</h1>
        <h1>Cliente: {cliente}</h1>
        <h1>CNPJ: {cnpj.format(cnpjCliente)}</h1>
      </section>
    </div>
  );
}

export default InfoClientes;
