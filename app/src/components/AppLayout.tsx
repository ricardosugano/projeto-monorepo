import { Outlet, Link } from "react-router-dom";

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