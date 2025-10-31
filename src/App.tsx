// // import "./App.css";
// // import { BrowserRouter, Route, Routes } from "react-router-dom";
// import Layout from "./pages/Layout";
// import NoPage from "./pages/NoPage";
// import LoginForm from "./pages/Login";


// function App() {
  // return (
  //   <>
  //     <BrowserRouter>
  //       <Routes>
  //         <Route path="/login" element={<LoginForm />} />
  //         <Route path="/" element={<Layout children={undefined} />}>
  //           <Route index element={<Home />} />
  //           <Route path="/criarProposta" element={<CriarProposta />} />
  //           {/* <Route path="/versionamento" element={<VerVersionamento />} /> */}
  //           <Route path="/notasFiscais" element={<NotasFiscais />} />
  //           <Route path="/medicao" element={<Medicao />} />
  //           <Route path="/adicionarMedicao" element={<AdicionarMedicao />} />
  //           <Route path="/cadastro" element={<CadastroCliente />} />
  //           <Route path="/clientes" element={<Clientes />} />
  //           <Route path="/propostas" element={<VerPropostas />} />
  //           <Route path="/diarioDeObra" element={<DiarioDeObra />} />
  //           <Route path="/diarioPorProposta/:idProposta" element={<MostrarDiarioDeObraPorProposta />} />
  //           <Route path="/criarDiarioDeObra" element={<CriarDiarioDeObra />} />
  //           <Route
  //             path="/proposta/versionamento/:id"
  //             element={<Versionamento />}
  //           />
  //           <Route path="/contratos" element={<Contratos />} />
  //           <Route path="/addContrato" element={<AddContrato />} />
  //           <Route
  //             path="/visualizarContrato/:id"
  //             element={<VisualizarContrato />}
  //           />
  //           <Route path="/clientes/:id" element={<EditarCliente />} />
  //           <Route path="*" element={<NoPage />} />
  //         </Route>
  //       </Routes>
  //     </BrowserRouter>
  //   </>
  // );
// }

// export default App;
import Home from "./pages/Home";
import NotasFiscais from "./pages/NotasFiscais";
import Medicao from "./pages/Medicao";
import AdicionarMedicao from "./pages/medicao/AdicionarMedicao"
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




function App() {
  const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // Layout com o menu
    children: [
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
        path: "medicao",
        element: <OnlyPlebes page={<Medicao />} />,
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
