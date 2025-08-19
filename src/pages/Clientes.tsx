import { useEffect, useState } from "react";

interface Clientes {
    id: number;
    cliente: string;
    cnpj: string;
    local: string;
    status: string;
}

export default function VerClientes() {
    const [clientes, setClientes] = useState<Clientes[]>([]);
    useEffect(() => {
        async function VerClientes() {
            const response = await fetch("http://localhost:3000/clientes");
            const body = await response.json();
            setClientes(body);
        }
        VerClientes();
    }, []);

     return (
    <div style={{ padding: "20px" }}>
      <h2>Lista de Clientes</h2>
      {clientes.map((c) => (
        <div key={c.id} style={{ border: "1px solid #ccc", marginBottom: "10px", padding: "10px", borderRadius: "8px" }}>
          <p><strong>Nome:</strong> {c.cliente}</p>
          <p><strong>CNPJ:</strong> {c.cnpj}</p>
          <p><strong>Local:</strong> {c.local}</p>
          <p><strong>Status:</strong> {c.status}</p>
        </div>
      ))}
    </div>
  );
}