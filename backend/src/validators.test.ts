import { describe, it, expect } from 'vitest';
import {
    isValidEmail,
    isStrongPassword,
    //validateUserInput,
    //UserInput,

} from './validators';

describe('Função isStrongPassword', () => {
    it('deve retornar true para uma senha forte', () => {
        const strongPassword = 'SenhaForte@123';
        const result = isStrongPassword(strongPassword);
        expect(result).toBe(true);
    });
});

it('deve retornar false para uma senha fraca', () => {
    const weakPassword = 'senha';
    const result = isStrongPassword(weakPassword);
    expect(result).toBe(false);
});


describe('Módulo de validação', () => {
    describe('isValidEmail', () => {
        it('deve retornar true para um email válido', () => {
            // 1. Arrange (Preparação)
            const validEmail = 'aluno.fatec@sp.gov.br';

            // 2. Act (Ação)
            const result = isValidEmail(validEmail);

            // 3. Assert (Verificação)
            expect(result).toBe(true);
        });
    });
})

it('deve rejeitar senhas sem letras maiúsculas', () => {
    const password = 'senha123@';
    const result = isStrongPassword(password);
    expect(result).toBe(false);
});

it('deve rejeitar senhas sem números', () => {
    const password = 'SenhaForte@';
    const result = isStrongPassword(password);
    expect(result).toBe(false);
});
