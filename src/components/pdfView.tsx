import { Viewer, Worker } from '@react-pdf-viewer/core';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';
import { getFilePlugin } from '@react-pdf-viewer/get-file';
import { printPlugin } from '@react-pdf-viewer/print';

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
                <div className="flex justify-center items-center gap-5 rounded-t-2xl bg-white p-4">
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
                <Viewer
                    fileUrl={url.url ?? ".pdf"}
                    plugins={[zoomPluginInstance, pageNavigationPluginInstance, getFilePluginInstance, printPluginInstance]}
                />

            </Worker>
        </>
    )
}

export default PdfView