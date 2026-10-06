import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import type { AuthContextType } from '../types/Auth';

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth deve ser usado obrigatoriamente dentro de um <AuthProvider>",
        );
    }
    return context;
}
