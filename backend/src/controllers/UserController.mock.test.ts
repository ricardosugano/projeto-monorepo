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

// Mock do bcryptjs
vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}));

describe('UserController - Testes com Mock', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ──────────────────────────────────────────────────────────────
  // GET /api/users  (index)
  // ──────────────────────────────────────────────────────────────
  describe('GET /api/users', () => {
    it('deve retornar status 200 e lista de usuários', async () => {
      // Arrange
      const usuariosFalsos = [
        {
          id: 1,
          nome: 'Alice Santos',
          email: 'alice@fatec.sp.gov.br',
          createdAt: '2026-01-01',
          updatedAt: '2026-01-01',
        },
      ];
      vi.mocked(User.findAll).mockResolvedValue(usuariosFalsos as any);

      // Act
      const response = await request(app).get('/api/users');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual(usuariosFalsos);
      expect(User.findAll).toHaveBeenCalledTimes(1);
    });

    it('deve retornar status 500 quando o banco falhar', async () => {
      // Arrange
      vi.mocked(User.findAll).mockRejectedValue(new Error('DB offline'));

      // Act
      const response = await request(app).get('/api/users');

      // Assert
      expect(response.status).toBe(500);
      expect(response.body.erro).toBe('Erro ao listar usuários');
    });
  });

  // ──────────────────────────────────────────────────────────────
  // GET /api/users/:id  (show)
  // ──────────────────────────────────────────────────────────────
  describe('GET /api/users/:id', () => {
    it('deve retornar 400 quando o ID for uma string não numérica', async () => {
      // Act
      const response = await request(app).get('/api/users/abc');

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.erro).toBe(
        'O ID informado deve ser um numero valido.',
      );
    });

    it('deve retornar 400 quando o ID for zero', async () => {
      // Act
      const response = await request(app).get('/api/users/0');

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.erro).toBe(
        'O ID informado deve ser um numero valido.',
      );
    });

    it('deve retornar 400 quando o ID for negativo', async () => {
      // Act
      const response = await request(app).get('/api/users/-5');

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.erro).toBe(
        'O ID informado deve ser um numero valido.',
      );
    });

    it('deve retornar 404 quando o usuário não for encontrado', async () => {
      // Arrange
      vi.mocked(User.findByPk).mockResolvedValue(null);

      // Act
      const response = await request(app).get('/api/users/999');

      // Assert
      expect(response.status).toBe(404);
      expect(response.body.erro).toBe('Usuário não encontrado.');
    });

    it('deve retornar 200 com os dados do usuário quando encontrado', async () => {
      // Arrange
      const usuarioFalso = {
        id: 1,
        nome: 'Alice Santos',
        email: 'alice@fatec.sp.gov.br',
        createdAt: '2026-01-01',
      };
      vi.mocked(User.findByPk).mockResolvedValue(usuarioFalso as any);

      // Act
      const response = await request(app).get('/api/users/1');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(1);
      expect(response.body.nome).toBe('Alice Santos');
    });

    it('deve retornar 500 quando o banco falhar', async () => {
      // Arrange
      vi.mocked(User.findByPk).mockRejectedValue(new Error('Falha'));

      // Act
      const response = await request(app).get('/api/users/1');

      // Assert
      expect(response.status).toBe(500);
      expect(response.body.erro).toBe('Erro ao buscar usuário');
    });
  });

  // ──────────────────────────────────────────────────────────────
  // POST /api/users  (create)
  // ──────────────────────────────────────────────────────────────
  describe('POST /api/users', () => {
    it('deve retornar 400 quando o nome estiver ausente', async () => {
      // Act
      const response = await request(app).post('/api/users').send({
        email: 'alice@fatec.sp.gov.br',
        password: 'senha123',
      });

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.erro).toBe('O campo nome é obrigatório.');
    });

    it('deve retornar 400 quando o nome for uma string vazia', async () => {
      // Act
      const response = await request(app).post('/api/users').send({
        nome: '   ',
        email: 'alice@fatec.sp.gov.br',
        password: 'senha123',
      });

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.erro).toBe('O campo nome é obrigatório.');
    });

    it('deve retornar 400 quando o nome não for uma string', async () => {
      // Act
      const response = await request(app).post('/api/users').send({
        nome: 12345,
        email: 'alice@fatec.sp.gov.br',
        password: 'senha123',
      });

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.erro).toBe('O campo nome é obrigatório.');
    });

    it('deve retornar 400 quando o email estiver ausente', async () => {
      // Act
      const response = await request(app).post('/api/users').send({
        nome: 'Alice Santos',
        password: 'senha123',
      });

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.erro).toBe('Informe um e-mail valido.');
    });

    it('deve retornar 400 quando o email tiver formato inválido', async () => {
      // Act
      const response = await request(app).post('/api/users').send({
        nome: 'Alice Santos',
        email: 'emailsemarroba',
        password: 'senha123',
      });

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.erro).toBe('Informe um e-mail valido.');
    });

    it('deve retornar 400 quando a senha tiver menos de 6 caracteres', async () => {
      // Act
      const response = await request(app).post('/api/users').send({
        nome: 'Alice Santos',
        email: 'alice@fatec.sp.gov.br',
        password: '123',
      });

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.erro).toBe(
        'A senha deve conter no minimo 6 caracteres.',
      );
    });

    it('deve retornar 400 quando a senha estiver ausente', async () => {
      // Act
      const response = await request(app).post('/api/users').send({
        nome: 'Alice Santos',
        email: 'alice@fatec.sp.gov.br',
      });

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.erro).toBe(
        'A senha deve conter no minimo 6 caracteres.',
      );
    });

    it('deve retornar 400 quando o e-mail já estiver cadastrado', async () => {
      // Arrange
      vi.mocked(User.findOne).mockResolvedValue({
        id: 10,
        email: 'alice@fatec.sp.gov.br',
      } as any);

      // Act
      const response = await request(app).post('/api/users').send({
        nome: 'Alice Santos',
        email: 'alice@fatec.sp.gov.br',
        password: 'senha123',
      });

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.erro).toBe(
        'Já existe um usuário cadastrado com este e-mail.',
      );
      expect(User.create).not.toHaveBeenCalled();
    });

    it('deve retornar 201 ao cadastrar um usuário com sucesso', async () => {
      // Arrange
      vi.mocked(User.findOne).mockResolvedValue(null);
      vi.mocked(bcrypt.hash).mockResolvedValue('$2a$10$hashgerado' as never);
      vi.mocked(User.create).mockResolvedValue({
        id: 1,
        nome: 'Alice Santos',
        email: 'alice@fatec.sp.gov.br',
        createdAt: new Date('2026-01-01'),
      } as any);

      // Act
      const response = await request(app).post('/api/users').send({
        nome: 'Alice Santos',
        email: 'alice@fatec.sp.gov.br',
        password: 'senha123',
      });

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.id).toBe(1);
      expect(response.body.nome).toBe('Alice Santos');
      expect(response.body).not.toHaveProperty('senha_hash');
    });

    it('deve retornar 500 quando o banco falhar durante o create', async () => {
      // Arrange
      vi.mocked(User.findOne).mockResolvedValue(null);
      vi.mocked(bcrypt.hash).mockResolvedValue('$2a$10$hash' as never);
      vi.mocked(User.create).mockRejectedValue(new Error('DB error'));

      // Act
      const response = await request(app).post('/api/users').send({
        nome: 'Alice Santos',
        email: 'alice@fatec.sp.gov.br',
        password: 'senha123',
      });

      // Assert
      expect(response.status).toBe(500);
      expect(response.body.erro).toBe('Erro ao cadastrar usuário');
    });
  });

  // ──────────────────────────────────────────────────────────────
  // PUT /api/users/:id  (update)
  // ──────────────────────────────────────────────────────────────
  describe('PUT /api/users/:id', () => {
    it('deve retornar 400 quando o ID for inválido', async () => {
      // Act
      const response = await request(app)
        .put('/api/users/abc')
        .send({ nome: 'Novo Nome' });

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.erro).toBe(
        'O ID informado deve ser um numero valido.',
      );
    });

    it('deve retornar 404 quando o usuário não for encontrado', async () => {
      // Arrange
      vi.mocked(User.findByPk).mockResolvedValue(null);

      // Act
      const response = await request(app)
        .put('/api/users/999')
        .send({ nome: 'Novo Nome' });

      // Assert
      expect(response.status).toBe(404);
      expect(response.body.erro).toBe('Usuário não encontrado.');
    });

    it('deve retornar 404 quando o nome informado for uma string vazia', async () => {
      // Arrange
      vi.mocked(User.findByPk).mockResolvedValue({
        id: 1,
        nome: 'Alice Santos',
        email: 'alice@fatec.sp.gov.br',
        save: vi.fn(),
      } as any);

      // Act
      const response = await request(app)
        .put('/api/users/1')
        .send({ nome: '   ' });

      // Assert
      expect(response.status).toBe(404);
      expect(response.body.erro).toBe(
        'O campo nome deve ser um texto valido.',
      );
    });

    it('deve retornar 404 quando o nome informado não for uma string', async () => {
      // Arrange
      vi.mocked(User.findByPk).mockResolvedValue({
        id: 1,
        nome: 'Alice Santos',
        email: 'alice@fatec.sp.gov.br',
        save: vi.fn(),
      } as any);

      // Act
      const response = await request(app)
        .put('/api/users/1')
        .send({ nome: 9999 });

      // Assert
      expect(response.status).toBe(404);
      expect(response.body.erro).toBe(
        'O campo nome deve ser um texto valido.',
      );
    });

    it('deve retornar 400 quando o email tiver formato inválido', async () => {
      // Arrange
      vi.mocked(User.findByPk).mockResolvedValue({
        id: 1,
        nome: 'Alice Santos',
        email: 'alice@fatec.sp.gov.br',
        save: vi.fn(),
      } as any);

      // Act
      const response = await request(app)
        .put('/api/users/1')
        .send({ email: 'emailinvalido' });

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.erro).toBe('Informe um e-mail valido.');
    });

    it('deve retornar 400 quando o email já estiver em uso por outro usuário', async () => {
      // Arrange
      vi.mocked(User.findByPk).mockResolvedValue({
        id: 1,
        nome: 'Alice Santos',
        email: 'alice@fatec.sp.gov.br',
        save: vi.fn(),
      } as any);
      // Outro usuário (id=2) já usa o e-mail
      vi.mocked(User.findOne).mockResolvedValue({
        id: 2,
        email: 'emuso@fatec.sp.gov.br',
      } as any);

      // Act
      const response = await request(app)
        .put('/api/users/1')
        .send({ email: 'emuso@fatec.sp.gov.br' });

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.erro).toBe('Este e-mail já está em uso.');
    });

    it('deve retornar 200 ao atualizar apenas o nome com sucesso', async () => {
      // Arrange
      const mockSave = vi.fn().mockResolvedValue(undefined);
      vi.mocked(User.findByPk).mockResolvedValue({
        id: 1,
        nome: 'Alice Santos',
        email: 'alice@fatec.sp.gov.br',
        createdAt: new Date('2026-01-01'),
        save: mockSave,
      } as any);

      // Act
      const response = await request(app)
        .put('/api/users/1')
        .send({ nome: 'Alice Atualizada' });

      // Assert
      expect(response.status).toBe(200);
      expect(mockSave).toHaveBeenCalledTimes(1);
    });

    it('deve retornar 200 ao atualizar o email para um endereço disponível', async () => {
      // Arrange: e-mail ainda não está em uso por ninguém
      const mockSave = vi.fn().mockResolvedValue(undefined);
      vi.mocked(User.findByPk).mockResolvedValue({
        id: 1,
        nome: 'Alice Santos',
        email: 'alice@fatec.sp.gov.br',
        createdAt: new Date('2026-01-01'),
        save: mockSave,
      } as any);
      vi.mocked(User.findOne).mockResolvedValue(null);

      // Act
      const response = await request(app)
        .put('/api/users/1')
        .send({ email: 'novo@fatec.sp.gov.br' });

      // Assert
      expect(response.status).toBe(200);
      expect(mockSave).toHaveBeenCalledTimes(1);
    });

    it('deve retornar 200 ao atualizar o email para o mesmo endereço do próprio usuário', async () => {
      // Arrange: findOne retorna o próprio usuário (mesmo id) — não deve ser considerado conflito
      const mockSave = vi.fn().mockResolvedValue(undefined);
      const mockUser = {
        id: 1,
        nome: 'Alice Santos',
        email: 'alice@fatec.sp.gov.br',
        createdAt: new Date('2026-01-01'),
        save: mockSave,
      };
      vi.mocked(User.findByPk).mockResolvedValue(mockUser as any);
      vi.mocked(User.findOne).mockResolvedValue({ ...mockUser, id: 1 } as any);

      // Act
      const response = await request(app)
        .put('/api/users/1')
        .send({ email: 'alice@fatec.sp.gov.br' });

      // Assert
      expect(response.status).toBe(200);
      expect(mockSave).toHaveBeenCalledTimes(1);
    });

    it('deve retornar 500 quando o banco falhar durante o update', async () => {
      // Arrange
      vi.mocked(User.findByPk).mockRejectedValue(new Error('DB error'));

      // Act
      const response = await request(app)
        .put('/api/users/1')
        .send({ nome: 'Nome Novo' });

      // Assert
      expect(response.status).toBe(500);
      expect(response.body.erro).toBe('Erro ao atualizar usuário');
    });
  });

  // ──────────────────────────────────────────────────────────────
  // DELETE /api/users/:id  (delete)
  // ──────────────────────────────────────────────────────────────
  describe('DELETE /api/users/:id', () => {
    it('deve retornar 400 quando o ID for inválido', async () => {
      // Act
      const response = await request(app).delete('/api/users/xyz');

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.erro).toBe(
        'O ID informado deve ser um numero valido.',
      );
    });

    it('deve retornar 400 quando o ID for zero', async () => {
      // Act
      const response = await request(app).delete('/api/users/0');

      // Assert
      expect(response.status).toBe(400);
    });

    it('deve retornar 404 quando o usuário não for encontrado', async () => {
      // Arrange
      vi.mocked(User.findByPk).mockResolvedValue(null);

      // Act
      const response = await request(app).delete('/api/users/999');

      // Assert
      expect(response.status).toBe(404);
      expect(response.body.erro).toBe('Usuário não encontrado.');
    });

    it('deve retornar 204 ao deletar o usuário com sucesso', async () => {
      // Arrange
      const mockDestroy = vi.fn().mockResolvedValue(undefined);
      vi.mocked(User.findByPk).mockResolvedValue({
        id: 1,
        nome: 'Alice Santos',
        email: 'alice@fatec.sp.gov.br',
        destroy: mockDestroy,
      } as any);

      // Act
      const response = await request(app).delete('/api/users/1');

      // Assert
      expect(response.status).toBe(204);
      expect(mockDestroy).toHaveBeenCalledTimes(1);
    });

    it('deve retornar 500 quando o banco falhar durante o delete', async () => {
      // Arrange
      vi.mocked(User.findByPk).mockRejectedValue(new Error('DB error'));

      // Act
      const response = await request(app).delete('/api/users/1');

      // Assert
      expect(response.status).toBe(500);
      expect(response.body.erro).toBe('Erro ao excluir usuário');
    });
  });
});
