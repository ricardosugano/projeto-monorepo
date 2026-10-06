import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  //1. Estado transitório: Aguarda a verificação do LocalStorage para determinar se o usuário está autenticado ou não.
  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <p>Carregando...</p>
        </div>  
    )

  //2. Estado de não autenticado: Redireciona o usuário para a página de login, preservando a rota original que ele tentou acessar.
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  //3. Estado de autenticado: Permite que o usuário acesse a rota protegida, renderizando o componente correspondente.
  return <Outlet />;
}
}
