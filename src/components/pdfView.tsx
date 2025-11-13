import { Viewer, Worker } from '@react-pdf-viewer/core';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';
import { getFilePlugin } from '@react-pdf-viewer/get-file';
import { printPlugin } from '@react-pdf-viewer/print';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

// Import styles
import '@react-pdf-viewer/print/lib/styles/index.css';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/zoom/lib/styles/index.css';
import '@react-pdf-viewer/page-navigation/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Button } from './ui/button';

interface PdfProp {
    url: string | undefined
}

function PdfView(url: PdfProp) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const zoomPluginInstance = zoomPlugin();
    const pageNavigationPluginInstance = pageNavigationPlugin();
    const getFilePluginInstance = getFilePlugin();

    const { ZoomInButton, ZoomOutButton, CurrentScale } = zoomPluginInstance;
    const { GoToNextPageButton, GoToPreviousPageButton, CurrentPageLabel } = pageNavigationPluginInstance;
    const { DownloadButton } = getFilePluginInstance;
    const printPluginInstance = printPlugin();
    const { Print } = printPluginInstance;
    
    return (
        <>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                {/* Desktop - toolbar normal */}
                <div className="hidden md:flex w-full justify-start items-center gap-3 rounded-t-2xl bg-white p-2 flex-wrap">
                    <Print>
                        {(props) => (
                            <Button
                                onClick={props.onClick}
                                className="cursor-pointer"
                            >
                                Imprimir
                            </Button>
                        )}
                    </Print>
                    <DownloadButton />
                    <ZoomOutButton />
                    <CurrentScale />
                    <ZoomInButton />
                    <GoToPreviousPageButton />
                    <CurrentPageLabel />
                    <GoToNextPageButton />
                </div>

                {/* Mobile - menu sanduíche */}
                <div className="md:hidden flex justify-between items-center bg-white p-3 rounded-t-2xl">
                    <span className="text-sm font-semibold">Ferramentas PDF</span>
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 hover:bg-gray-100 rounded"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile - menu aberto */}
                {isMenuOpen && (
                    <div className="md:hidden flex flex-col gap-2 bg-gray-50 p-3 border-b border-gray-200">
                        <Print>
                            {(props) => (
                                <Button
                                    onClick={() => {
                                        props.onClick();
                                        setIsMenuOpen(false);
                                    }}
                                    className="cursor-pointer w-full justify-start"
                                >
                                    Imprimir
                                </Button>
                            )}
                        </Print>
                        <div className="flex gap-2 flex-wrap">
                            <DownloadButton />
                            <ZoomOutButton />
                            <CurrentScale />
                            <ZoomInButton />
                            <GoToPreviousPageButton />
                            <CurrentPageLabel />
                            <GoToNextPageButton />
                        </div>
                    </div>
                )}

                <Viewer 
                    key={url.url}
                    fileUrl={url.url ?? ".pdf"}
                    plugins={[zoomPluginInstance, pageNavigationPluginInstance, getFilePluginInstance, printPluginInstance]}
                />

            </Worker>
        </>
    )
}

export default PdfView