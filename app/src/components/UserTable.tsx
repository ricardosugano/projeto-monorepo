import type { User } from "..types/user";

export interface UserTableProps {
    usuarios: User[];
    carregando: boolean;

}

export function UserTable({ usuarios, carregando } : UserTableProps) {
    //Estado 1: Carregamento
    if (carregando) {
        return (
            <div style={{ textAlign: "center", padding: "32px", color: "#6b7280"}}>
                Carregando lista de usuários...
            </div>
        );
    }

    //estado 2: Nenhum registro encontrado
    if (usuarios.lengh === 0) {
        return (
            <div style={{
                testAlign: "center",
                padding: "32px",
                color: "#6b7280",
                border: "1px dashed #d1d5db",
                borderRadius: "8px",
            }}
            >
                nenhum usuário cadastrado até o momento.
            </div>
        )
    }

    //estado 3: Lista de dados preenchida
    return (
        <div style = {{ overflowX: "auto"}}>
            <table
                style={{ width: "100%", borderCollapse: "collapse", marginTop: "8px"}}
                >
                <thead>
                    <tr
                    style={{
                        backgroundColor: "#f3"
                    }}
                    ></tr>
                </thead>
                </table>
        </div>
    )
}