// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { useState } from "react";
// import PdfView from "./pdfView";

// interface props {
//     anexos: string [] | null
// }

// function carroucelPdf(anexos: props){
//     const [currentImageIndex, setCurrentImageIndex] = useState(0);
//     const handleNextImage = () => {
//     setCurrentImageIndex((prev) =>
//       prev === anexos.length - 1 ? 0 : prev + 1
//     );
//   };

//   const handlePrevImage = () => {
//     setCurrentImageIndex((prev) =>
//       prev === 0 ? anexos.length - 1 : prev - 1
//     );
//   };
//     return(
//         (() => {
//               const pdfAnexos = (anexoVersionamento || []).filter((anexo) => {
//                 // const extFromPath = anexo?.path?.split(".").pop()?.toLowerCase();
//                 const extFromUrl = anexo?.url?.split(".").pop()?.split("?")[0]?.toLowerCase();
//                 return extFromUrl === "pdf";
//               });

//               if (pdfAnexos.length === 0) {
//                 return <span>Nenhum anexo PDF encontrado.</span>;
//               }

//               return (
//                 <div className="w-full flex flex-col gap-4">
//                   <div className="flex items-center justify-between bg-gray-100 rounded-2xl p-2">
//                     <button
//                       onClick={handlePrevImage}
//                       className="p-1 rounded hover:bg-gray-200"
//                     >
//                       <ChevronLeft className="w-6 h-6" />
//                     </button>

//                     <div className="flex flex-col items-center gap-3 flex-1 mx-4">
//                       <div className="w-full h-[500px] bg-white rounded overflow-hidden shadow-sm">
//                         <PdfView url={anexoContrato[currentImageIndex]?.url} />
//                       </div>

//                       <span className="text-sm font-semibold text-gray-600">
//                         {currentImageIndex + 1} de {pdfAnexos.length}
//                       </span>
//                     </div>

//                     <button
//                       onClick={handleNextImage}
//                       className="p-1 rounded hover:bg-gray-200"
//                     >
//                       <ChevronRight className="w-6 h-6" />
//                     </button>
//                   </div>

//                   <div className="flex gap-2 justify-center mt-2">
//                     {pdfAnexos.map((_, idx) => (
//                       <button
//                         key={idx}
//                         onClick={() => setCurrentImageIndex(idx)}
//                         className={`h-2 rounded-full transition-all ${idx === currentImageIndex ? "w-6 bg-blue-500" : "w-2 bg-gray-300"}`}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               );
//             })()
//     )
// }