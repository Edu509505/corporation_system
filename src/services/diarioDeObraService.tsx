
const url = import.meta.env.VITE_API_URL;

export async function fetchDiarioDeObraPorProposta(idProposta: string) {
  console.log('ID da proposta recebido:', idProposta);

  const response = await fetch(`${url}/diario-de-obra/proposta/${idProposta}`);
  if (!response.ok) {
    throw new Error('Erro ao buscar diário de obra');
  }
  return response.json();
}