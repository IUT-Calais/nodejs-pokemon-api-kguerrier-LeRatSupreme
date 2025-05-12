import request from 'supertest';
import { app } from '../src';
import { prismaMock } from './jest.setup';

describe('PokemonCard API', () => {
  describe('GET /pokemon-cards', () => {
    it('should return all Pokemon cards', async () => {
      const mockCards = [
        { id: 1, name: 'Bulbasaur', pokedexId: 1, typeId: 1, lifePoints: 45, size: null, weight: null, imageUrl: null },
        { id: 2, name: 'Charmander', pokedexId: 4, typeId: 2, lifePoints: 39, size: null, weight: null, imageUrl: null },
      ];

      prismaMock.pokemonCard.findMany.mockResolvedValue(mockCards);

      const response = await request(app).get('/pokemons-cards');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCards);
    });

    it('should return 500 if an unexpected error occurs', async () => {
      prismaMock.pokemonCard.findMany.mockRejectedValue(new Error('Unexpected error'));
      const response = await request(app).get('/pokemons-cards');
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Une erreur est survenue lors de la récupération des cartes Pokémon' });
    });
  });

  describe('GET /pokemon-cards/:pokemonCardId', () => {
    it('should return a Pokemon card by ID', async () => {
      const mockCard = { id: 1, name: 'Bulbasaur', pokedexId: 1, typeId: 1, lifePoints: 45, size: null, weight: null, imageUrl: null };

      prismaMock.pokemonCard.findUnique.mockResolvedValue(mockCard);

      const response = await request(app).get('/pokemons-cards/1');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCard);
    });

    it('should return 404 if the Pokemon card is not found', async () => {
      prismaMock.pokemonCard.findUnique.mockResolvedValue(null);

      const response = await request(app).get('/pokemons-cards/999');
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Carte Pokémon non trouvée.' });
    });

    it('should return 400 if the ID is invalid', async () => {
      const response = await request(app).get('/pokemons-cards/invalid-id');
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: "L'ID du Pokémon est invalide." });
    });

    it('should return 500 if an unexpected error occurs', async () => {
      prismaMock.pokemonCard.findUnique.mockRejectedValue(new Error('Unexpected error'));
      const response = await request(app).get('/pokemons-cards/1');
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: "Une erreur est survenue lors de la récupération de la carte Pokémon." });
    });
  });

  describe('POST /pokemon-cards', () => {
    it('should create a new Pokemon card', async () => {
      const newCard = { name: 'Bulbasaur', pokedexId: 1, type: 1, lifePoints: 45 };
      const createdCard = { id: 1, ...newCard, typeId: 1, size: null, weight: null, imageUrl: null };

      prismaMock.pokemonCard.create.mockResolvedValue(createdCard);

      const response = await request(app)
          .post('/pokemons-cards')
          .send(newCard)
          .set('Authorization', 'Bearer mockedToken');
      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdCard);
    });

    it('should return 400 if required fields are missing', async () => {
      const incompleteData = { name: 'Bulbasaur' };
      const response = await request(app)
          .post('/pokemons-cards')
          .send(incompleteData)
          .set('Authorization', 'Bearer mockedToken');
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Tous les champs sont requis.' });
    });

    it('should return 500 if an unexpected error occurs', async () => {
      prismaMock.pokemonCard.create.mockRejectedValue(new Error('Unexpected error'));
      const validData = {
        name: 'Bulbasaur',
        pokedexId: 1,
        type: 1,
        lifePoints: 45,
      };
      const response = await request(app)
          .post('/pokemons-cards')
          .send(validData)
          .set('Authorization', 'Bearer mockedToken');
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Erreur interne du serveur' });
    });
  });

  describe('PATCH /pokemon-cards/:pokemonCardId', () => {
    it('should update a Pokemon card by ID', async () => {
      const updatedData = { name: 'Ivysaur', pokedexId: 2, typeId: 1, lifePoints: 60 };
      const updatedCard = { id: 1, ...updatedData, size: null, weight: null, imageUrl: null };

      prismaMock.pokemonCard.update.mockResolvedValue(updatedCard);

      const response = await request(app)
          .patch('/pokemons-cards/1')
          .send(updatedData)
          .set('Authorization', 'Bearer mockedToken');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedCard);
    });

    it('should return 400 if the ID is invalid', async () => {
      const response = await request(app)
          .patch('/pokemons-cards/invalid-id')
          .send({ name: 'Updated Name' })
          .set('Authorization', 'Bearer mockedToken');
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: "L'ID du Pokémon est invalide." });
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
          .patch('/pokemons-cards/1')
          .send({ name: '' })
          .set('Authorization', 'Bearer mockedToken');
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Tous les champs sont requis.' });
    });

    it('should return 500 if an unexpected error occurs', async () => {
      prismaMock.pokemonCard.update.mockRejectedValue(new Error('Unexpected error'));
      const validData = {
        name: 'Updated Name',
        pokedexId: 1,
        typeId: 1,
        lifePoints: 50,
      };
      const response = await request(app)
          .patch('/pokemons-cards/1')
          .send(validData)
          .set('Authorization', 'Bearer mockedToken');
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Une erreur est survenue lors de la mise à jour de la carte Pokémon.' });
    });
  });

  describe('DELETE /pokemon-cards/:pokemonCardId', () => {
    it('should delete a Pokemon card by ID', async () => {
      const deletedCard = { id: 1, name: 'Bulbasaur', pokedexId: 1, typeId: 1, lifePoints: 45, size: null, weight: null, imageUrl: null };

      prismaMock.pokemonCard.delete.mockResolvedValue(deletedCard);

      const response = await request(app)
          .delete('/pokemons-cards/1')
          .set('Authorization', 'Bearer mockedToken');
      expect(response.status).toBe(204);
    });

    it('should return 400 if the ID is invalid', async () => {
      const response = await request(app)
          .delete('/pokemons-cards/invalid-id')
          .set('Authorization', 'Bearer mockedToken');
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: "L'ID du Pokémon est invalide." });
    });

    it('should return 500 if an unexpected error occurs', async () => {
      prismaMock.pokemonCard.delete.mockRejectedValue(new Error('Unexpected error'));
      const response = await request(app)
          .delete('/pokemons-cards/1')
          .set('Authorization', 'Bearer mockedToken');
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Une erreur est survenue lors de la suppression de la carte Pokémon.' });
    });
  });
});