import { useSuspenseQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

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
    queryKey: ["getPeriodoDeObra", dataInicial || dataFinal],
    queryFn: async () => {
      const response = await fetch(
        `${url}/diarioDeObraPeriodo/${format(
          new Date(dataInicial as Date),
          "yyyy-MM-dd"
        )}/${format(
          new Date(dataFinal as Date),
          "yyyy-MM-dd"
        )}/proposta/${idProposta}`,{
          method: "GET",
          credentials: "include"
        }
      );
      if (!response.ok) throw new Error("Propostas não encontradas");
      const data = await response.json();
      return data as DiarioDeObra[];
    },
  });

  const { data: quantitativa } = useSuspenseQuery({
    queryKey: ["quantitativa", dataInicial || dataFinal],
    queryFn: async () => {
      const response = await fetch(`${url}/quantitativa/${idProposta}`,{
        method: "GET",
        credentials: "include"
      });
      if (!response.ok) throw new Error("Nenhuma quantitativa encontrada");
      const data = await response.json();
      return data as Quantitativa[];
    },
  });

  console.log("Quantitativa ", quantitativa[0].descricao);

  console.log("Periodo", periodo);

  return (
    <section className="h-full">
      <div className="overflow-hidden rounded-md border">
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
                    {quantitativa[value2.idQuantitativa - 1].descricao}
                  </TableCell>
                  <TableCell>
                    {quantitativa[value2.idQuantitativa - 1].unidadeDeMedida}
                  </TableCell>
                  <TableCell>{value2.quantidade}</TableCell>
                  <TableCell>
                    {Intl.NumberFormat("PT-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(
                      quantitativa[value2.idQuantitativa - 1].valorUnitario
                    )}
                  </TableCell>
                  <TableCell>
                    {Intl.NumberFormat("PT-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(
                      quantitativa[value2.idQuantitativa - 1].valorUnitario *
                        value2.quantidade
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}

export default PeriodoFechamento;
