import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import NoPage from "./pages/NoPage";
import NotasFiscais from "./pages/NotasFiscais";
import Medicao from "./pages/Medicao";
import AddMedicao from "./pages/addMedicao/AddMedicaoPasso1";
import Login from "./pages/Login";
import CadastroCliente from "./pages/clientes/CadastroCliente"
import Clientes from "./pages/Clientes"
import EditarCliente from "./pages/clientes/cliente[userId]/EditarCliente"
import CriarProposta from "./pages/propostas/CriarProposta";
import VerPropostas from "./pages/Propostas";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/criarProposta" element={<CriarProposta />} />
          <Route path="/" element={<Layout children={undefined} />}>
            <Route index element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/notasFiscais" element={<NotasFiscais />} />
            <Route path="/medicao" element={<Medicao />} />
            <Route path="/adicionarMedicao" element={<AddMedicao />} />
            <Route path="/cadastro" element={<CadastroCliente />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/propostas" element={<VerPropostas />} />
            <Route path="/clientes/:id" element={<EditarCliente />} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
