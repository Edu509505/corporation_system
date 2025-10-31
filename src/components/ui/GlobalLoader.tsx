
import logo from "../../assets/img/logo.png"

export function GlobalLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-white gap-4">
      <img
        src={logo}
        alt="Logo da empresa"
        className="h-16 w-auto animate-pulse"
      />
      <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-green-500 border-solid" />
      <p className="text-sm text-muted-foreground">Verificando sessão...</p>
    </div>
  );
}
