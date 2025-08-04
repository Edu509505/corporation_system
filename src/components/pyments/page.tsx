import { columns, type Payment } from "./columns"
import { DataTable } from "./data-table"
 
async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    { id: '1', empresa: 'PortoMar Logística', situacao: 'Ativo', emissao: '03/12/2018', local: 'Curitiba', valor: 7320},
    { id: '2', empresa: 'NavSul Transportes', situacao: 'Pendente', emissao: '15/06/2021', local: 'Belém', valor: 5400},
    { id: '3', empresa: 'BrasilCargo Ltda.', situacao: 'Cancelado', emissao: '27/11/2014', local: 'Campinas', valor: 9980},
    { id: '4', empresa: 'Oceânica S.A.', situacao: 'Ativo', emissao: '09/08/2009', local: 'Florianópolis', valor: 1200 },
    { id: '5', empresa: 'TransVia Brasil', situacao: 'Cancelado', emissao: '30/01/2023', local: 'Ribeirão Preto', valor: 4860},
    { id: '6', empresa: 'Maré Alta Freight', situacao: 'Ativo', emissao: '18/04/2010', local: 'Manaus', valor: 7700},
    { id: '7', empresa: 'DockXpress', situacao: 'Ativo', emissao: '05/05/2016', local: 'Recife', valor: 1095 },
    { id: '8', empresa: 'LogNet Solutions', situacao: 'Pendente', emissao: '12/03/2022', local: 'São Luís', valor: 8450},
    { id: '9', empresa: 'CargaPrime Express', situacao: 'Ativo', emissao: '28/07/2015', local: 'Joinville', valor: 6120},
    { id: '10', empresa: 'RotaMar Global', situacao: 'Cancelado', emissao: '06/02/2019', local: 'Vitória', valor: 1033 },
    { id: '11', empresa: 'CargaPrime Express', situacao: 'Ativo', emissao: '28/07/2015', local: 'Joinville', valor: 6120 },
    { id: '12', empresa: 'NavSul Transportes', situacao: 'Pendente', emissao: '15/06/2021', local: 'Belém', valor: 5400},
    { id: '13', empresa: 'BrasilCargo Ltda.', situacao: 'Cancelado', emissao: '27/11/2014', local: 'Campinas', valor: 9980},
    { id: '14', empresa: 'Oceânica S.A.', situacao: 'Ativo', emissao: '09/08/2009', local: 'Florianópolis', valor: 1200 },
    { id: '15', empresa: 'TransVia Brasil', situacao: 'Cancelado', emissao: '30/01/2023', local: 'Ribeirão Preto', valor: 4860},
    { id: '16', empresa: 'Maré Alta Freight', situacao: 'Ativo', emissao: '18/04/2010', local: 'Manaus', valor: 7700},
    { id: '17', empresa: 'DockXpress', situacao: 'Ativo', emissao: '05/05/2016', local: 'Recife', valor: 1095 },
    { id: '18', empresa: 'LogNet Solutions', situacao: 'Pendente', emissao: '12/03/2022', local: 'São Luís', valor: 8450},
    { id: '19', empresa: 'CargaPrime Express', situacao: 'Ativo', emissao: '28/07/2015', local: 'Joinville', valor: 6120},
    { id: '20', empresa: 'RotaMar Global', situacao: 'Cancelado', emissao: '06/02/2019', local: 'Vitória', valor: 1033 },
    { id: '21', empresa: 'CargaPrime Express', situacao: 'Ativo', emissao: '28/07/2015', local: 'Joinville', valor: 6120 },
    { id: '22', empresa: 'NavSul Transportes', situacao: 'Pendente', emissao: '15/06/2021', local: 'Belém', valor: 5400},
    { id: '23', empresa: 'BrasilCargo Ltda.', situacao: 'Cancelado', emissao: '27/11/2014', local: 'Campinas', valor: 9980},
    { id: '24', empresa: 'Oceânica S.A.', situacao: 'Ativo', emissao: '09/08/2009', local: 'Florianópolis', valor: 1200 },
    { id: '25', empresa: 'TransVia Brasil', situacao: 'Cancelado', emissao: '30/01/2023', local: 'Ribeirão Preto', valor: 4860},
    { id: '26', empresa: 'Maré Alta Freight', situacao: 'Ativo', emissao: '18/04/2010', local: 'Manaus', valor: 7700},
    { id: '27', empresa: 'DockXpress', situacao: 'Ativo', emissao: '05/05/2016', local: 'Recife', valor: 1095 },
    { id: '28', empresa: 'LogNet Solutions', situacao: 'Pendente', emissao: '12/03/2022', local: 'São Luís', valor: 8450},
    { id: '29', empresa: 'CargaPrime Express', situacao: 'Ativo', emissao: '28/07/2015', local: 'Joinville', valor: 6120},
    { id: '30', empresa: 'NavSul Transportes', situacao: 'Pendente', emissao: '15/06/2021', local: 'Belém', valor: 5400}
  ]
}

export default async function DemoPage() {
  const data = await getData()

  return (
    <div className="container mx-auto">
      <DataTable columns={columns} data={data} />
    </div>
  )
}