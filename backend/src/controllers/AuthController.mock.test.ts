import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../app';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';

// Mock do model User
vi.mock('../models/User', () => ({
  User: {
    findAll: vi.fn(),
    findByPk: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    destroy: vi.fn(),
  },
}));

// Mock do bcryptjs para controlar o resultado da comparação de senha
vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}));

describe('AuthController - Testes com Mock', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/auth/login', () => {
    it('deve retornar 400 quando email e senha não forem informados', async () => {
      // Arrange & Act
      const response = await request(app).post('/api/auth/login').send({});

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.erro).toBe('Email e senha são obrigatórios');
    });

    it('deve retornar 400 quando apenas o email for informado', async () => {
      // Arrange & Act
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'teste@fatec.sp.gov.br' });

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.erro).toBe('Email e senha são obrigatórios');
    });

    it('deve retornar 400 quando apenas a senha for informada', async () => {
      // Arrange & Act
      const response = await request(app)
        .post('/api/auth/login')
        .send({ password: 'senha123' });

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.erro).toBe('Email e senha são obrigatórios');
    });

    it('deve retornar 401 quando o usuário não for encontrado no banco', async () => {
      // Arrange
      vi.mocked(User.findOne).mockResolvedValue(null);

      // Act
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'naoexiste@fatec.sp.gov.br', password: 'senha123' });

      // Assert
      expect(response.status).toBe(401);
      expect(response.body.erro).toBe('Credenciais invalidas.');
      expect(User.findOne).toHaveBeenCalledTimes(1);
    });

    it('deve retornar 401 quando o usuário existir mas não tiver senha_hash', async () => {
      // Arrange: usuário existe mas sem senha_hash (cenário de dados inconsistentes)
      vi.mocked(User.findOne).mockResolvedValue({
        id: 1,
        email: 'teste@fatec.sp.gov.br',
        nome: 'Teste',
        senha_hash: null,
      } as any);

      // Act
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'teste@fatec.sp.gov.br', password: 'senha123' });

      // Assert
      expect(response.status).toBe(401);
      expect(response.body.erro).toBe('Credenciais invalidas.');
    });

    it('deve retornar 401 quando a senha informada for inválida', async () => {
      // Arrange
      vi.mocked(User.findOne).mockResolvedValue({
        id: 1,
        email: 'teste@fatec.sp.gov.br',
        nome: 'Teste Silva',
        senha_hash: '$2a$10$hashvalido',
      } as any);
      vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

      // Act
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'teste@fatec.sp.gov.br', password: 'senhaErrada' });

      // Assert
      expect(response.status).toBe(401);
      expect(response.body.erro).toBe('Credenciais invalidas.');
      expect(bcrypt.compare).toHaveBeenCalledTimes(1);
    });

    it('deve retornar 200 com token JWT quando as credenciais forem válidas', async () => {
      // Arrange
      vi.mocked(User.findOne).mockResolvedValue({
        id: 1,
        email: 'teste@fatec.sp.gov.br',
        nome: 'Teste Silva',
        senha_hash: '$2a$10$hashvalido',
      } as any);
      vi.mocked(bcrypt.compare).mockResolvedValue(true as never);

      // Act
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'teste@fatec.sp.gov.br', password: 'senhaCorreta123' });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.mensagem).toBe('Login realizado com sucesso!');
      expect(response.body.token).toBeDefined();
      expect(typeof response.body.token).toBe('string');
    });

    it('deve retornar 500 quando ocorrer um erro inesperado no banco de dados', async () => {
      // Arrange
      vi.mocked(User.findOne).mockRejectedValue(
        new Error('Conexão com banco falhou'),
      );

      // Act
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'teste@fatec.sp.gov.br', password: 'senha123' });

      // Assert
      expect(response.status).toBe(500);
      expect(response.body.erro).toBeDefined();
    });
  });
});
