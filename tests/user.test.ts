import request from 'supertest';
import { app, stopServer } from '../src';
import { prismaMock } from './jest.setup';


afterAll(() => {
  stopServer();
});

describe('User API', () => {
  describe('POST /users', () => {
    it('should create a new user', async () => {
      const testUserIn = { email: 'testuserfdfsdfxfdf@gmail.com', password: '12345' };
      const testUserOut = { id: 2, email: 'testusersdfsdf@gmail.com', password: '$2b$10$66xbmRxvlUIaI42rxtw0QevD04TJ749nm/iWLeTsBLMxevsiXA2BW' };

      prismaMock.user.create.mockResolvedValue(testUserOut);

      const response = await request(app).post('/users').send(testUserIn);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(testUserOut);
    });
  });

  /*describe('POST /login', () => {
    it('should login a user and return a token', async () => {
      const user = {};
      const token = 'mockedToken';

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        token,
        message: 'Connexion réussie',
      });
    });
  });*/
});
