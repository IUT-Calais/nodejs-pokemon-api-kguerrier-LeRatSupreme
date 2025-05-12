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
      expect(response.body).toHaveProperty('user', expectedUser);
      expect(response.body).toHaveProperty('token');
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

    it('should return 400 if email or password is missing when creating a user', async () => {
      const incompleteUser = { email: 'testuser@gmail.com' };

      const response = await request(app)
          .post('/users')
          .send(incompleteUser);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Tous les champs sont requis.' });
    });
  });

  describe('POST /users/login', () => {
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

    it('should return 400 if email format is invalid', async () => {
      const invalidEmailUser = { email: 'invalid-email', password: 'testpassword' };

      const response = await request(app)
          .post('/users/login')
          .send(invalidEmailUser);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: "Format de l'email invalide." });
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
  });

  describe('GET /users', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { id: 1, email: 'user1@gmail.com', password: 'hashedpassword1' },
        { id: 2, email: 'user2@gmail.com', password: 'hashedpassword2' },
      ];

      prismaMock.user.findMany.mockResolvedValue(mockUsers);

      const response = await request(app).get('/users');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUsers);
    });

    it('should return 500 if an unexpected error occurs', async () => {
      prismaMock.user.findMany.mockRejectedValue(new Error('Unexpected error'));

      const response = await request(app).get('/users');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Erreur interne du serveur.' });
    });
  });

  describe('GET /users/:userId', () => {
    it('should return a user by ID', async () => {
      const mockUser = { id: 1, email: 'user1@gmail.com', password: 'hashedpassword1' };

      prismaMock.user.findUnique.mockResolvedValue(mockUser);

      const response = await request(app).get('/users/1').set('Authorization', `Bearer mockedToken`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
    });

    it('should return 404 if the user is not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      const response = await request(app).get('/users/999').set('Authorization', `Bearer mockedToken`);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Utilisateur non trouvé.' });
    });

    it('should return 400 if the ID is invalid', async () => {
      const response = await request(app).get('/users/invalid-id').set('Authorization', `Bearer mockedToken`);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: "L'ID de l'utilisateur est invalide." });
    });

    it('should return 500 if an unexpected error occurs', async () => {
      prismaMock.user.findUnique.mockRejectedValue(new Error('Unexpected error'));

      const response = await request(app).get('/users/1').set('Authorization', `Bearer mockedToken`);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Erreur interne du serveur.' });
    });
  });

  describe('PATCH /users/:userId', () => {
    it('should update a user by ID', async () => {
      const updatedData = { email: 'updateduser@gmail.com', password: 'newpassword' };
      const updatedUser = { id: 1, email: 'updateduser@gmail.com', password: 'hashednewpassword' };

      prismaMock.user.update.mockResolvedValue(updatedUser);

      const response = await request(app)
          .patch('/users/1')
          .send(updatedData)
          .set('Authorization', 'Bearer mockedToken');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedUser);
    });

    it('should return 400 if the ID is invalid', async () => {
      const response = await request(app)
          .patch('/users/invalid-id')
          .send({ email: 'updateduser@gmail.com' })
          .set('Authorization', 'Bearer mockedToken');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: "L'ID de l'utilisateur est invalide." });
    });

    it('should return 401 if no token is provided', async () => {
      const response = await request(app)
          .patch('/users/1')
          .send({ email: 'updateduser@gmail.com' });

      expect(response.status).toBe(401);
    });

    it('should return 400 if email is already used', async () => {
      prismaMock.user.update.mockRejectedValue({
        code: 'P2002',
        meta: { target: ['email'] },
      });

      const response = await request(app)
          .patch('/users/1')
          .send({ email: 'existingemail@gmail.com' })
          .set('Authorization', 'Bearer mockedToken');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Email déjà utilisé.' });
    });

    it('should return 400 if no fields are provided for update', async () => {
      const response = await request(app)
          .patch('/users/1')
          .send({})
          .set('Authorization', 'Bearer mockedToken');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Au moins un champ doit être fourni pour la mise à jour.' });
    });

    it('should return 500 if an unexpected error occurs', async () => {
      prismaMock.user.update.mockRejectedValue(new Error('Unexpected error'));

      const response = await request(app)
          .patch('/users/1')
          .send({ email: 'updateduser@gmail.com' })
          .set('Authorization', 'Bearer mockedToken');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Erreur interne du serveur.' });
    });

    it('should return 400 if no fields are provided for update', async () => {
      const response = await request(app)
          .patch('/users/1')
          .send({})
          .set('Authorization', 'Bearer mockedToken');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Au moins un champ doit être fourni pour la mise à jour.' });
    });
  });

  describe('DELETE /users/:userId', () => {
    it('should delete a user by ID', async () => {
      prismaMock.user.delete.mockResolvedValue({ id: 1, email: 'user1@gmail.com', password: 'hashedpassword1' });

      const response = await request(app)
          .delete('/users/1')
          .set('Authorization', 'Bearer mockedToken');

      expect(response.status).toBe(204);
    });

    it('should return 400 if the ID is invalid', async () => {
      const response = await request(app)
          .delete('/users/invalid-id')
          .set('Authorization', 'Bearer mockedToken');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: "L'ID de l'utilisateur est invalide." });
    });

    it('should return 401 if no token is provided', async () => {
      const response = await request(app).delete('/users/1');

      expect(response.status).toBe(401);
    });

    it('should return 500 if an unexpected error occurs', async () => {
      prismaMock.user.delete.mockRejectedValue(new Error('Unexpected error'));

      const response = await request(app)
          .delete('/users/1')
          .set('Authorization', 'Bearer mockedToken');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Erreur interne du serveur.' });
    });
  });
});