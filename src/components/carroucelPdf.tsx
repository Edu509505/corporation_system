import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import PdfView from "./pdfView";

interface Props {
  anexos: string[] | null;
}

export function CarroucelPdf({ anexos }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!anexos || anexos.length === 0) {
    return <span>Nenhum anexo PDF encontrado.</span>;
  }

  const pdfAnexos = anexos.filter((url) => {
    const ext = url?.split(".").pop()?.split("?")[0]?.toLowerCase();
    return ext === "pdf";
  });

  if (pdfAnexos.length === 0) {
    return <span>Nenhum anexo PDF encontrado.</span>;
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === pdfAnexos.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? pdfAnexos.length - 1 : prev - 1));
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center justify-between bg-gray-100 rounded-2xl p-2">
        <button onClick={handlePrev} className="p-1 rounded hover:bg-gray-200">
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center gap-3 flex-1 mx-4">
          <div className="w-full h-[500px] bg-white rounded overflow-hidden shadow-sm">
            <PdfView url={pdfAnexos[currentIndex]} />
          </div>
          <span className="text-sm font-semibold text-gray-600">
            {currentIndex + 1} de {pdfAnexos.length}
          </span>
        </div>

        <button onClick={handleNext} className="p-1 rounded hover:bg-gray-200">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <div className="flex gap-2 justify-center mt-2">
        {pdfAnexos.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all ${
              idx === currentIndex ? "w-6 bg-blue-500" : "w-2 bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
