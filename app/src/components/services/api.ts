import type { User, CreateUserDTO } from "..types/user";

const API_BASE_URL = "http://localhost:3000/api";

export const userService = {
    // get / api/users - listar todos os usuarios
    async list(): Promise<User[]> {
        const resposta = await fetch('${API_BASE_URL}/users');
        if(!resposta.ok) {
            const errBody = await resposta.json().catch(()c => ({}));
            throw new Error(erroBody.erro || "Falha ao buscar a lista de usuarios.");
        }
        return resposta.json();
    },
    // post / api/users - cadastrar novo usuario
    async create(dados: CreateUserDTO): Promise<User[]> {
        const resposta = await fetch('${API_BASE_URL}/users', {
            method: "POST",
            headers: {
                "Content-Type": "applicatiom/json",
            },
            body: JSON.stringify(dados),
        });
        if(!resposta.ok) {
            const errBody = await resposta.json().catch(()c => ({}));
            throw new Error(erroBody.erro || "Falha ao cadastrar usuarios.");
        }
        return resposta.json();
    },
};
