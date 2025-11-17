import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import PageTableDiarioDeObras from "@/components/diarioDeObra/page";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Create from "@/components/diarioDeObra/Create";

export default function ListaDeDiarios() {

  return (
    <>
      <main className="flex flex-col items-center justify-start h-screen p-2 pt-5 pb-10 gap-3 bg-background">
        <article className="items-start w-full ">
          <h1 className="font-bold text-3xl">Diario De Obra</h1>
          {/* <h2>Metragem de contratos e trabalhos avulso</h2> */}
        </article>
        <article className="w-full">
          <div className="flex items-center justify-end w-full">
            <Dialog>
                <DialogTrigger asChild>
                  <Button variant="default" className="cursor-pointer"><CirclePlus/>Criar Diário</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle className="flex gap-3 items-center"><CirclePlus /> Adicionar Diário de Obra</DialogTitle>
                    <DialogDescription>
                      Preencha os itens abaixo para criar um novo diário
                    </DialogDescription>
                  </DialogHeader>
                    <Create />
                </DialogContent>
            </Dialog>
          </div>
          <PageTableDiarioDeObras />
        </article>
      </main>
    </>
  );
}
