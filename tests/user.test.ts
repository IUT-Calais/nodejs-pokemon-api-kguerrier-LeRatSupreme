import request from 'supertest';
import { app } from '../src';
import { prismaMock } from './jest.setup';

describe('User API', () => {
  describe('POST /users', () => {
    it('should create a new user', async () => {
      const createdUser = {
        email: 'testuser@gmail.com',
        password: 'testpassword',
      };

      const expectedUser = {
        id: 1,
        email: 'testuser@gmail.com',
        password: '$2b$10$hashedpassword',
      };

      prismaMock.user.create.mockResolvedValue(expectedUser);

      const response = await request(app)
          .post('/users')
          .send(createdUser);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(expectedUser);
    });

    it('should return 400 if required fields are missing', async () => {
      const incompleteUser = { email: 'testuser@gmail.com' };

      const response = await request(app)
          .post('/users')
          .send(incompleteUser);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Tous les champs sont requis.' });
    });

    it('should return 400 if user already exists', async () => {
      prismaMock.user.create.mockRejectedValue({
        code: 'P2002',
        meta: { target: ['email'] },
      });

      const existingUser = {
        email: 'testuser@gmail.com',
        password: 'testpassword',
      };

      const response = await request(app)
          .post('/users')
          .send(existingUser);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Utilisateur déjà existant.' });
    });

    it('should return 500 if an unexpected error occurs', async () => {
      prismaMock.user.create.mockRejectedValue(new Error('Unexpected error'));

      const newUser = {
        email: 'newuser@gmail.com',
        password: 'newpassword',
      };

      const response = await request(app)
          .post('/users')
          .send(newUser);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Erreur interne du serveur.' });
    });
  });

  describe('POST /login', () => {
    it('should login a user and return a token', async () => {
      const user = {
        email: 'testuser@gmail.com',
        password: 'testpassword',
      };

      const hashedPassword = '$2b$10$hashedpassword';
      const token = 'mockedToken';

      prismaMock.user.findFirst.mockResolvedValue({
        id: 1,
        email: 'testuser@gmail.com',
        password: hashedPassword,
      });

      jest.spyOn(require('bcrypt'), 'compare').mockResolvedValue(true);
      jest.spyOn(require('jsonwebtoken'), 'sign').mockReturnValue(token);

      const response = await request(app)
          .post('/users/login')
          .send(user);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token', token);
      expect(response.body.message).toBe('Connexion réussie.');
    });

    it('should return 404 if user is not found', async () => {
      prismaMock.user.findFirst.mockResolvedValue(null);

      const user = {
        email: 'nonexistent@gmail.com',
        password: 'testpassword',
      };

      const response = await request(app)
          .post('/users/login')
          .send(user);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Utilisateur non trouvé.' });
    });

    it('should return 400 if password is incorrect', async () => {
      const user = {
        email: 'testuser@gmail.com',
        password: 'wrongpassword',
      };

      const hashedPassword = '$2b$10$hashedpassword';

      prismaMock.user.findFirst.mockResolvedValue({
        id: 1,
        email: user.email,
        password: hashedPassword,
      });

      jest.spyOn(require('bcrypt'), 'compare').mockResolvedValue(false);

      const response = await request(app)
          .post('/users/login')
          .send(user);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Mot de passe incorrect.' });
    });

    it('should return 400 if required fields are missing', async () => {
      const incompleteLogin = { email: 'testuser@gmail.com' };

      const response = await request(app)
          .post('/users/login')
          .send(incompleteLogin);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Tous les champs sont requis.' });
    });

    it('should return 500 if an unexpected error occurs', async () => {
      prismaMock.user.findFirst.mockRejectedValue(new Error('Unexpected error'));

      const user = {
        email: 'testuser@gmail.com',
        password: 'testpassword',
      };

      const response = await request(app)
          .post('/users/login')
          .send(user);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Erreur interne du serveur.' });
    });

    it('should return 400 if email format is invalid', async () => {
      const invalidEmailUser = {
        email: 'invalid-email',
        password: 'testpassword',
      };

      const response = await request(app)
          .post('/users/login')
          .send(invalidEmailUser);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Format de l\'email invalide.' });
    });
  });
});