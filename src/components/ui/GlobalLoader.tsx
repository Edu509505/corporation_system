
import logo from "../../assets/img/logo.svg"
import { Spinner } from "./spinner";

export function GlobalLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-white gap-4">
      <img
        src={logo}
        alt="Logo da empresa"
        className="size-50"
      />
      <Spinner className="text-green-800"/>
    </div>
  );
}
