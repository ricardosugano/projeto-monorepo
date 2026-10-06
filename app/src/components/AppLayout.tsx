import { Outlet, Link } from "react-router-dom";
import { AppLayout } from "./AppLayout";
import { useAuth } from "../hooks/useAuth";

export function AppLayout() {
  const { isAuthenticated } = useAuth();
  
}

function Dashboard() {
    return (
    <h2 className="text-xl font-bold text-slate-800">Painel Principal</h2>;
    );
}

function Perfil() {
    return (
    <h2 className="text-xl font-bold text-slate-800">Perfil do Usuário</h2>
    );
}


export function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
        <header className="bg-gray-800 text-white p-4">
          <h1 className="text-2xl font-bold">Sistema Web</h1>
          <span className="font-bold">Welcome to My App</span>

        </header>

      <main className="flex-1 max-w-6x1 w-full mx-auto p-6">
        <Link to="/" className="mr-4 hover:underline">
          Inicio
        </Link>
        <Link to="/sobre" className="hover:underline">
          Sobre
        </Link>
      </main>
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
}   