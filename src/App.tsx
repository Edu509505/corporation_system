import Home from "./pages/Home";
import NotasFiscais from "./pages/NotasFiscais";
import Medicao from "./pages/Medicao";
import AdicionarMedicao from "./pages/medicao/AdicionarMedicao";
import CadastroCliente from "./pages/clientes/CadastroCliente";
import Clientes from "./pages/Clientes";
import EditarCliente from "./pages/clientes/cliente[userId]/EditarCliente";
import CriarProposta from "./pages/propostas/CriarProposta";
import VerPropostas from "./pages/Propostas";
import Versionamento from "./pages/versionamento/Versionamento";
import Contratos from "./pages/Contratos";
import AddContrato from "./pages/contratos/AddContrato";
import VisualizarContrato from "./pages/contratos/VisualizarContrato";
import DiarioDeObra from "./pages/DiarioDeObra";
import CriarDiarioDeObra from "./components/diarioDeObra/Create";
import MostrarDiarioDeObraPorProposta from "./pages/DiarioPorProposta";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import LoginPage from "./pages/Login";
import { OnlyPlebes } from "./permissions/onlyPlebes";
import Layout from "./pages/Layout";
import { Navigate } from "react-router-dom";
import AddNotaFiscal from "./pages/faturamento/AddNotaFiscal";
import VisualizarMedicao from "./pages/medicao/VisualizarMedicao";
import VisualizarNotaFiscal from "./pages/faturamento/visuaizarFaturamento"

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />, // Layout com o menu
      children: [
        {
          path: "", // rota raiz
          element: <Navigate to="/#" replace />,
        },
        {
          path: "login",
          element: <LoginPage />,
        },
        {
          path: "cadastro",
          element: <OnlyPlebes page={<CadastroCliente />} />,
        },
        {
          path: "home",
          element: <OnlyPlebes page={<Home />} />,
        },
        {
          path: "criarProposta",
          element: <OnlyPlebes page={<CriarProposta />} />,
        },
        {
          path: "notasFiscais",
          element: <OnlyPlebes page={<NotasFiscais />} />,
        },
        {
          path: "addNotaFiscal",
          element: <OnlyPlebes page={<AddNotaFiscal />} />,
        },
        {
          path: "visualizarNotaFiscal/:id",
          element: <OnlyPlebes page={<VisualizarNotaFiscal />} />,
        },
        {
          path: "medicao",
          element: <OnlyPlebes page={<Medicao />} />,
        },
        {
          path: "visualizarMedicao/:id",
          element: <OnlyPlebes page={<VisualizarMedicao />} />,
        },
        {
          path: "adicionarMedicao",
          element: <OnlyPlebes page={<AdicionarMedicao />} />,
        },
        {
          path: "clientes",
          element: <OnlyPlebes page={<Clientes />} />,
        },
        {
          path: "clientes/:id",
          element: <OnlyPlebes page={<EditarCliente />} />,
        },
        {
          path: "propostas",
          element: <OnlyPlebes page={<VerPropostas />} />,
        },
        {
          path: "diarioDeObra",
          element: <OnlyPlebes page={<DiarioDeObra />} />,
        },
        {
          path: "diarioPorProposta/:idProposta",
          element: <OnlyPlebes page={<MostrarDiarioDeObraPorProposta />} />,
        },
        {
          path: "criarDiarioDeObra",
          element: <OnlyPlebes page={<CriarDiarioDeObra />} />,
        },
        {
          path: "proposta/versionamento/:id",
          element: <OnlyPlebes page={<Versionamento />} />,
        },
        {
          path: "contratos",
          element: <OnlyPlebes page={<Contratos />} />,
        },
        {
          path: "addContrato",
          element: <OnlyPlebes page={<AddContrato />} />,
        },
        {
          path: "visualizarContrato/:id",
          element: <OnlyPlebes page={<VisualizarContrato />} />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
