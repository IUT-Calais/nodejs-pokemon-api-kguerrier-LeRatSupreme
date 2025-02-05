import request from 'supertest';
import { app } from '../src';
import { prismaMock } from './jest.setup';

describe('PokemonCard API', () => {
  describe('GET /pokemon-cards', () => {
    it('should fetch all PokemonCards', async () => {
      const mockPokemonCards = [
        {
          "id": 1,
          "name": "Charmander",
          "pokedexId": 4,
          "lifePoints": 39,
          "size": 0.6,
          "weight": 8.5,
          "imageUrl": "charmander",
          "typeId": 2
        },
        {
          "id": 2,
          "name": "Squirtle",
          "pokedexId": 7,
          "lifePoints": 44,
          "size": 0.5,
          "weight": 9,
          "imageUrl": "squirtle",
          "typeId": 3
        },
        {
          "id": 3,
          "name": "Bulbasaur",
          "pokedexId": 1,
          "lifePoints": 45,
          "size": 0.7,
          "weight": 6.9,
          "imageUrl": "bulbasaur",
          "typeId": 4
        },
        {
          "id": 4,
          "name": "Jigglypuff",
          "pokedexId": 39,
          "lifePoints": 115,
          "size": 0.5,
          "weight": 5.5,
          "imageUrl": "jigglypuff",
          "typeId": 1
        },
        {
          "id": 5,
          "name": "Gengar",
          "pokedexId": 94,
          "lifePoints": 60,
          "size": 1.5,
          "weight": 40.5,
          "imageUrl": "gengar",
          "typeId": 14
        },
        {
          "id": 6,
          "name": "Eevee",
          "pokedexId": 133,
          "lifePoints": 55,
          "size": 0.3,
          "weight": 6.5,
          "imageUrl": "eevee",
          "typeId": 1
        },
        {
          "id": 7,
          "name": "Snorlax",
          "pokedexId": 143,
          "lifePoints": 160,
          "size": 2.1,
          "weight": 460,
          "imageUrl": "snorlax",
          "typeId": 1
        },
        {
          "id": 8,
          "name": "Dragonite",
          "pokedexId": 149,
          "lifePoints": 91,
          "size": 2.2,
          "weight": 210,
          "imageUrl": "dragonite",
          "typeId": 15
        },
        {
          "id": 9,
          "name": "Mewtwo",
          "pokedexId": 150,
          "lifePoints": 106,
          "size": 2,
          "weight": 122,
          "imageUrl": "mewtwo",
          "typeId": 11
        },
        {
          "id": 10,
          "name": "Bulbizarre 214",
          "pokedexId": 549,
          "lifePoints": 45,
          "size": null,
          "weight": null,
          "imageUrl": null,
          "typeId": 1
        }
      ];




      const response = await request(app).get('/pokemons-cards');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPokemonCards);
    });
  });

  describe('GET /pokemon-cards/:pokemonCardId', () => {
    it('should fetch a PokemonCard by ID', async () => {
      const mockPokemonCard = {
        "id": 5,
        "name": "Gengar",
        "pokedexId": 94,
        "lifePoints": 60,
        "size": 1.5,
        "weight": 40.5,
        "imageUrl": "gengar",
        "typeId": 14
      };

      const response = await request(app).get('/pokemons-cards/5');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPokemonCard);
    });

    it('should return 404 if PokemonCard is not found', async () => {
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'PokemonCard not found' });
    });
  });

  describe('POST /pokemon-cards', () => {
    it('should create a new PokemonCard', async () => {
      const createdPokemonCard = {};

      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdPokemonCard);
    });
  });

  describe('PATCH /pokemon-cards/:pokemonCardId', () => {
    it('should update an existing PokemonCard', async () => {
      const updatedPokemonCard = {};

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedPokemonCard);
    });
  });

  describe('DELETE /pokemon-cards/:pokemonCardId', () => {
    it('should delete a PokemonCard', async () => {
      expect(response.status).toBe(204);
    });
  });
});
