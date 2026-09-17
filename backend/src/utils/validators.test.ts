import { describe, it, expect } from 'vitest';
import {
  isValidEmail,
  isStrongPassword,
  validateUserInput,
  UserInput,
} from './validators';

describe('Módulo de Validação: validators.ts', () => {

  describe('Função isValidEmail', () => {

    it('Deve retornar true para um endereço de e-mail válido - AAA (Arrange, Act, Assert)', () => {
      // 1. Arrange (Preparar)
      const validEmail = 'aluno.fatec@sp.gov.br';

      // 2. Act (Agir)
      const result = isValidEmail(validEmail);

      // 3. Assert (Afirmar)
      expect(result).toBe(true);
    });

    it('Deve retornar false para e-mails com formato inválido', () => {
      // Arrange & Act & Assert
      expect(isValidEmail('usuario_sem_arroba.com')).toBe(false);
      expect(isValidEmail('usuario@dominio')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });

  });

  describe('Função isStrongPassword', () => {

    it('Deve aceitar uma senha com 8 caracteres, maiúscula e número', () => {
      // Arrange
      const strongPassword = 'Password123';

      // Act
      const result = isStrongPassword(strongPassword);

      // Assert
      expect(result).toBe(true);
    });

    it('Deve rejeitar senhas com menos de 8 caracteres', () => {
      // Arrange
      const shortPassword = 'Pass1';

      // Act
      const result = isStrongPassword(shortPassword);

      // Assert
      expect(result).toBe(false);
    });

    it('Deve rejeitar senhas sem letras maiúsculas', () => {
      // Arrange
      const noUpperPassword = 'password123';

      // Act
      const result = isStrongPassword(noUpperPassword);

      // Assert
      expect(result).toBe(false);
    });

    it('Deve rejeitar senhas sem números', () => {
      // Arrange
      const noNumberPassword = 'PasswordSemNumero';

      // Act
      const result = isStrongPassword(noNumberPassword);

      // Assert
      expect(result).toBe(false);
    });

  });

  describe('Função validateUserInput', () => {

    it('Deve validar com sucesso um usuário com todos os campos corretos', () => {
      // Arrange
      const input: UserInput = {
        name: 'Carlos Silva',
        email: 'carlos.silva@fatec.sp.gov.br',
        password: 'Password123',
        role: 'aluno',
      };

      // Act
      const validation = validateUserInput(input);

      // Assert
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('Deve retornar erro quando o nome tiver menos de 3 caracteres', () => {
      // Arrange
      const input: Partial<UserInput> = {
        name: 'AB',
        email: 'aluno@fatec.sp.gov.br',
        password: 'Password123',
        role: 'aluno',
      };

      // Act
      const validation = validateUserInput(input);

      // Assert
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain(
        'O nome deve conter no mínimo 3 caracteres.',
      );
    });

    it('Deve retornar erro para perfil de acesso inválido', () => {
      // Arrange
      const input = {
        name: 'Carlos Silva',
        email: 'carlos.silva@fatec.sp.gov.br',
        password: 'Password123',
        role: 'visitante' as any,
      };

      // Act
      const validation = validateUserInput(input);

      // Assert
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain(
        'O Perfil de acesso informado é inválido.',
      );
    });

  });

});