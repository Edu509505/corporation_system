export type Cliente = {
    id: number,
    cliente: string | null,
    cnpj: string | null,
    local: string | null,
    status:  "Ativo" | "Pendente" | "Inativo" | null;
}

export type Contrato = {
    id: number,
    idCliente: number,
    contrato: string,
    nome: string,
    descricao: string,
    status: string,
    local: string,
}