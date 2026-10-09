import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authMiddleware } from './authMiddleware';

// Mock do jsonwebtoken para controlar o comportamento do verify
vi.mock('jsonwebtoken', () => ({
  default: {
    verify: vi.fn(),
    sign: vi.fn(),
  },
}));

// Helpers para criar mocks do Request, Response e NextFunction do Express
function makeMockReq(authHeader?: string): Partial<Request> {
  return {
    headers: authHeader ? { authorization: authHeader } : {},
  };
}

function makeMockRes(): { res: Partial<Response>; status: ReturnType<typeof vi.fn>; json: ReturnType<typeof vi.fn> } {
  const json = vi.fn().mockReturnThis();
  const status = vi.fn().mockReturnValue({ json });
  const res: Partial<Response> = { status } as any;
  return { res, status, json };
}

function makeMockNext(): NextFunction {
  return vi.fn() as unknown as NextFunction;
}

describe('authMiddleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve retornar 401 quando o cabeçalho Authorization não estiver presente', () => {
    // Arrange
    const req = makeMockReq();
    const { res, status, json } = makeMockRes();
    const next = makeMockNext();

    // Act
    authMiddleware(req as Request, res as Response, next);

    // Assert
    expect(status).toHaveBeenCalledWith(401);
    expect(json).toHaveBeenCalledWith({ erro: 'Token não fornecido.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve retornar 401 quando o cabeçalho Authorization não iniciar com "Bearer "', () => {
    // Arrange
    const req = makeMockReq('Basic tokenqualquer');
    const { res, status, json } = makeMockRes();
    const next = makeMockNext();

    // Act
    authMiddleware(req as Request, res as Response, next);

    // Assert
    expect(status).toHaveBeenCalledWith(401);
    expect(json).toHaveBeenCalledWith({ erro: 'Token não fornecido.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve retornar 401 quando o token for inválido ou expirado', () => {
    // Arrange: jwt.verify lança erro para token inválido
    vi.mocked(jwt.verify).mockImplementation(() => {
      throw new Error('jwt expired');
    });
    const req = makeMockReq('Bearer tokeninvalido');
    const { res, status, json } = makeMockRes();
    const next = makeMockNext();

    // Act
    authMiddleware(req as Request, res as Response, next);

    // Assert
    expect(status).toHaveBeenCalledWith(401);
    expect(json).toHaveBeenCalledWith({ erro: 'Token invalido ou expirado.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve chamar next() e salvar o usuário decodificado na requisição quando o token for válido', () => {
    // Arrange
    const payload = { id: 1, email: 'alice@fatec.sp.gov.br', nome: 'Alice' };
    vi.mocked(jwt.verify).mockReturnValue(payload as any);
    const req = makeMockReq('Bearer tokenvalido') as any;
    const { res } = makeMockRes();
    const next = makeMockNext();

    // Act
    authMiddleware(req as Request, res as Response, next);

    // Assert
    expect(next).toHaveBeenCalledTimes(1);
    expect(req.user).toEqual(payload);
  });

  it('deve verificar o token extraído corretamente do cabeçalho Authorization', () => {
    // Arrange
    const payload = { id: 2, email: 'bob@fatec.sp.gov.br', nome: 'Bob' };
    vi.mocked(jwt.verify).mockReturnValue(payload as any);
    const req = makeMockReq('Bearer meu.token.jwt') as any;
    const { res } = makeMockRes();
    const next = makeMockNext();

    // Act
    authMiddleware(req as Request, res as Response, next);

    // Assert
    expect(jwt.verify).toHaveBeenCalledWith(
      'meu.token.jwt',
      expect.any(String),
    );
  });
});
