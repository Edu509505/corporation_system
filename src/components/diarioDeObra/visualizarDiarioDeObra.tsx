import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useQuery } from "@tanstack/react-query";
const url = import.meta.env.VITE_API_URL;

interface PropDiario {
  id: number | null;
}

interface ItensDia {
  createdAt: string;
  descricao: string;
  id: number;
  idDiarioDeObra: number;
  idQuantitativa: number;
  quantidade: number;
  updatedAt: string;
  diarioDeObraItensDia: {
    createdAt: string;
    dataDia: string;
    id: number;
    idCliente: number;
    idMedicao: number;
    idProposta: number;
    updatedAt: string;
  };
  quantitativaItensDia: {
    createdAt: string;
    descricao: string;
    id: number;
    idVersionamento: number;
    quantidade: number;
    unidadeDeMedida: string;
    updatedAt: string;
    valorUnitario: number;
  };
}

function VisualizarDiarioDeObra(id: PropDiario) {
  const { data: itensDiaDiario } = useQuery({
    queryKey: ["itensDiaDiario", id],
    queryFn: async () => {
      const response = await fetch(`${url}/itensDia/DiarioDeObra/${id.id}`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("DiarioDeObra não encontrada");
      const data = await response.json();
      return data as ItensDia[];
    },
  });

  console.log(itensDiaDiario);

  return (
    <div className="w-full overflow-auto">
      <Table className="bg-white">
        <TableHeader className="bg-gray-300">
          <TableRow>
            <TableHead>Descrição</TableHead>
            <TableHead>Item</TableHead>
            <TableHead>Medida</TableHead>
            <TableHead>Quantidade</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {itensDiaDiario?.map((item) => (
            <TableRow>
              <TableCell>{item.descricao}</TableCell>
              <TableCell>{item.quantitativaItensDia.descricao}</TableCell>
              <TableCell>{item.quantitativaItensDia.unidadeDeMedida}</TableCell>
              <TableCell>{item.quantidade}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default VisualizarDiarioDeObra;
