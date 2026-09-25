import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../app';

describe('Testes de integração: rotas de usuários (/api/users)', () => {
  describe('GET /api/users', () => {
    it('deve retornar status 200 e uma lista de usuários em JSON', async () => {
        const response = await request(app).get('/api/users');
        console.log('Status:', response.status);
        console.log('Corpo:', response.body);
        console.log('Texto:', response.text);
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch(/json/);
        expect(Array.isArray(response.body)).toBe(true);

      if (response.body.length > 0) {
        expect(response.body[0]).toHaveProperty('id');
        expect(response.body[0]).toHaveProperty('nome');
        expect(response.body[0]).toHaveProperty('email');
        expect(response.body[0]).not.toHaveProperty('senha_hash');
      }
    });
  });
});