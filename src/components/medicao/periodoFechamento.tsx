import { useSuspenseQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { MessageCircleWarningIcon } from "lucide-react";
const url = import.meta.env.VITE_API_URL;

interface PeriodoFechamentoProps {
  dataInicial: Date | null;
  dataFinal: Date | null;
  idProposta: string | undefined;
}

interface DiarioDeObra {
  id: number;
  idProposta: number;
  idMedicao: number | null;
  dataDia: string;
  createdAt: Date;
  updatedAt: Date;
  itensDoDia: [
    {
      id: number;
      idDiarioDeObra: number;
      idQuantitativa: number;
      descricao: String;
      quantidade: number;
      createdAt: string;
      updatedAt: string;
    }
  ];
}

interface Quantitativa {
  id: number;
  idVersionamento: number;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
  unidadeDeMedida: string;
  createdAt: string;
  updatedAt: string;
}

function PeriodoFechamento({
  dataInicial,
  dataFinal,
  idProposta,
}: PeriodoFechamentoProps) {
  const { data: periodo } = useSuspenseQuery({
    queryKey: ["getPeriodoDeObra", dataInicial, dataFinal, idProposta],
    queryFn: async () => {
      const response = await fetch(
        `${url}/diarioDeObraPeriodo/${format(
          new Date(dataInicial as Date),
          "yyyy-MM-dd"
        )}/${format(
          new Date(dataFinal as Date),
          "yyyy-MM-dd"
        )}/proposta/${idProposta}`
      );
      if (!response.ok) throw new Error("Propostas não encontradas");
      const data = await response.json();
      return data as DiarioDeObra[];
    },
  });

  const { data: quantitativa } = useSuspenseQuery({
    queryKey: ["quantitativa", dataInicial, dataFinal, idProposta],
    queryFn: async () => {
      const response = await fetch(`${url}/quantitativa/${idProposta}`);
      if (!response.ok) throw new Error("Nenhuma quantitativa encontrada");
      const data = await response.json();
      return data as Quantitativa[];
    },
  });

  // A função abaixo pega pega item por item sem rpetir e faz soma de forma individual
  //exemplo: se no fechamento tem retro ele vai pegar essa retro filtrar depois vai verificar quantas tem e somar tudo
  function calculo(val: number | null) {
    let resultado = null as any;
    const calculo = periodo
      .map((value) =>
        value.itensDoDia
          .map((value2) => value2.idQuantitativa === val && value2.quantidade)
          .filter((valor) => valor)
      )
      .flat();

    for (let i = 0; i < calculo.length; i++) {
      resultado += calculo[i];
    }

    return resultado;
  }

  //Aqui ele pega tudo já somado e faz a soma final
  // Exemplo: vai pegar todos os resultados da tabela, multiplicar pelo valor definido na quantitativa e logo após isso vai somar tudo

  function resultadosSomados() {
    let resultado = null as any;
    const resultadoFinal = quantitativa.map(
      (value) => calculo(value.id) * value.valorUnitario
    );

    for (let i = 0; i < resultadoFinal.length; i++) {
      resultado += resultadoFinal[i];
    }

    return resultado;
  }

  return (
    <main className="h-full flex flex-col gap-3">
      <section className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Medida</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Valor Unitário</TableHead>
              <TableHead>Valor Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {periodo.map((value) =>
              value.itensDoDia.map((value2) => (
                <TableRow key={value2.id}>
                  <TableCell>
                    {format(new Date(value.dataDia), "dd/MM")}
                  </TableCell>
                  <TableCell>{value2.descricao}</TableCell>
                  <TableCell>
                    {
                      quantitativa.find((q) => q.id === value2.idQuantitativa)
                        ?.descricao
                    }
                  </TableCell>
                  <TableCell>
                    {
                      quantitativa.find((q) => q.id === value2.idQuantitativa)
                        ?.unidadeDeMedida
                    }
                  </TableCell>
                  <TableCell>{value2.quantidade}</TableCell>
                  <TableCell>
                    {Intl.NumberFormat("PT-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(
                      quantitativa.find((q) => q.id === value2.idQuantitativa)
                        ?.valorUnitario as number
                    )}
                  </TableCell>
                  <TableCell>
                    {Intl.NumberFormat("PT-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(
                      (quantitativa.find((q) => q.id === value2.idQuantitativa)
                        ?.valorUnitario as number) * value2.quantidade
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </section>
      <section className="flex flex-col gap-2 mt-6">
        <div className="flex gap-3 items-center">
          <MessageCircleWarningIcon className="size-7" />
          <h1 className="font-bold text-2xl">Resumo da medição</h1>
        </div>
        <h1 className="text-gray-600">
          Aqui está o resumo da sua medição com base no período definido{" "}
        </h1>
        <h1 className="font-bold">Totais presente na medição</h1>
        <section className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Medida</TableHead>
                <TableHead>Valor Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quantitativa.map((value) => (
                <TableRow key={value.id}>
                  <TableCell>{value.descricao}</TableCell>
                  <TableCell>{calculo(value.id)}</TableCell>
                  <TableCell>{value.unidadeDeMedida}</TableCell>
                  <TableCell>
                    {Intl.NumberFormat("PT-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(calculo(value.id) * value.valorUnitario)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell>
                  {Intl.NumberFormat("PT-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(resultadosSomados() as number)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </section>
      </section>
    </main>
  );
}

export default PeriodoFechamento;
