import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import NoPage from "./pages/NoPage";
import NotasFiscais from "./pages/NotasFiscais";
import Medicao from "./pages/Medicao";
import AdicionarMedicao from "./pages/medicao/AdicionarMedicao"
import LoginForm from "./pages/Login";
import CadastroCliente from "./pages/clientes/CadastroCliente";
import Clientes from "./pages/Clientes";
import EditarCliente from "./pages/clientes/cliente[userId]/EditarCliente";
import CriarProposta from "./pages/propostas/CriarProposta";
import VerPropostas from "./pages/Propostas";
import VerVersionamento from "./Versionamento";
import Versionamento from "./pages/versionamento/Versionamento";
import Contratos from "./pages/Contratos";
import AddContrato from "./pages/contratos/AddContrato";
import VisualizarContrato from "./pages/contratos/VisualizarContrato";
import DiarioDeObra from "./pages/DiarioDeObra";
import CriarDiarioDeObra from "./pages/diarioDeObra/Create";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/" element={<Layout children={undefined} />}>
            <Route index element={<Home />} />
            <Route path="/criarProposta" element={<CriarProposta />} />
            <Route path="/versionamento" element={<VerVersionamento />} />
            <Route path="/notasFiscais" element={<NotasFiscais />} />
            <Route path="/medicao" element={<Medicao />} />
            <Route path="/adicionarMedicao" element={<AdicionarMedicao />} />
            <Route path="/cadastro" element={<CadastroCliente />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/propostas" element={<VerPropostas />} />
            <Route path="/diario-de-obra" element={<DiarioDeObra />} />
            {/* <Route path="/diario-de-obra/proposta/:idProposta" element={<DiarioDeObra />} /> */}
            <Route path="/criarDiarioDeObra" element={<CriarDiarioDeObra />} />
            <Route
              path="/proposta/versionamento/:id"
              element={<Versionamento />}
            />
            <Route path="/contratos" element={<Contratos />} />
            <Route path="/addContrato" element={<AddContrato />} />
            <Route
              path="/visualizarContrato/:id"
              element={<VisualizarContrato />}
            />
            <Route path="/clientes/:id" element={<EditarCliente />} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
