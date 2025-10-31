// import { create } from "zustand"

// interface DiarioDeObra {
//   id: number | null;
//   idProposta: number | null;
//   idMedicao: number | null;
//   dataDia: string | null;
//   itensDoDia: Array<{
//     id: number | null;
//     idDiarioDeObra: number | null;
//     idQuantitativa: number | null;
//     descricao: string | null;
//     quantidade: number | null;
//     createdAt: string | null;
//     updatedAt: string | null;
//   }> | null;
// }

// // interface Quantitativa {
// //   id: number;
// //   idVersionamento: number;
// //   descricao: string;
// //   quantidade: number;
// //   valorUnitario: number;
// //   unidadeDeMedida: string;
// //   createdAt: string;
// //   updatedAt: string;
// // }

// const itensMedicao = create<DiarioDeObra>((set) => ({
//     id: null,
//     dataDia: null,
//     idMedicao: null,
//     idProposta: null,
//     itensDoDia: null,
    
//     adicionarId: () => set((estado) => ({id: estado.id})),
//     removerEstado: () => set({ id: null }),
//     // modificar: (adicionando) => set({ id: adicionando })
// }))

// export default itensMedicao