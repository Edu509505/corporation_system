export type Cliente = {
    id: number,
    cliente: string,
    cnpj: string,
    local: string,
    status: string,
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