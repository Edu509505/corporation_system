export type Cliente = {
  id: number;
  name: string;
  cnpj: string;
  local: string;
  status: "ATIVO" | "INATIVO";
  path: string;
};

export type Contrato = {
  id: number;
  idCliente: number;
  contrato: string;
  nome: string;
  descricao: string;
  status: string;
  local: string;
};
