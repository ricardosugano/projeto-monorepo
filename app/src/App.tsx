import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";


function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold">Welcome to the Home Page</h1>
      <Link to="/about" className="mt-4 text-blue-500 hover:underline">
        Go to About Page
      </Link>
    </div>
  );
}

function Sobre() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold">Sobre Nós</h1>
      <Link to="/" className="mt-4 text-blue-500 hover:underline">
        Voltar para Home
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
    <Routes>
    <nav>
      <Link to="/">Inicio</Link>
      <Link to="/sobre">Sobre</Link>
    </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<Sobre />} />
      </Routes>
      </Routes>
    </BrowserRouter>
  );
}