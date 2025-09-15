import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const url = import.meta.env.VITE_API_URL;

interface versionamento {
  versao: number;
  idProposta: number;
  status: string;
}

interface Propostas {
  nomeDaProposta: string;
  descricao: string;
  createdAt: string;
  cliente: {
    cliente: string;
  };
}

function Versionamento() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [proposta, setProposta] = useState<Propostas>({
    nomeDaProposta: "",
    descricao: "",
    createdAt: "",
    cliente: { cliente: "" },
  });

  useEffect(() => {
    async function fetchProposta() {
      try {
        const response = await fetch(`${url}/propostas/${id}/versao`);
        if (!response.ok) throw new Error("Proposta não encontrada");
        const data = await response.json();
        setProposta({
          nomeDaProposta: data.nomeDaProposta || "",
          descricao: data.descricao || "",
          createdAt: data.createdAt || "",
          cliente: { cliente: data.cliente || "" },
        });
      } catch (err) {}
    }

    if (id) fetchProposta();
    else {
      console.log("Deu erro aqui");
    }
  }, [id]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex">
        <section>
          <h1 className="font-bold text-2xl">Versionamento de Proposta</h1>
          {proposta.nomeDaProposta}
        </section>
        <section>
          <iframe></iframe>
        </section>
      </div>
    </div>
  );
}

export default Versionamento;
