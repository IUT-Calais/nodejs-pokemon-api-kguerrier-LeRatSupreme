import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.pokemonCard.deleteMany();
  await prisma.type.deleteMany();
  await prisma.user.deleteMany();

  await prisma.type.createMany({
    data: [
      { name: 'Normal' },
      { name: 'Fire' },
      { name: 'Water' },
      { name: 'Grass' },
      { name: 'Electric' },
      { name: 'Ice' },
      { name: 'Fighting' },
      { name: 'Poison' },
      { name: 'Ground' },
      { name: 'Flying' },
      { name: 'Psychic' },
      { name: 'Bug' },
      { name: 'Rock' },
      { name: 'Ghost' },
      { name: 'Dragon' },
      { name: 'Dark' },
      { name: 'Steel' },
      { name: 'Fairy' },
    ],
  });

  await prisma.pokemonCard.createMany({
    data: [
      {
        name: 'Charmander', typeId: 2,
        pokedexId: 4,
        lifePoints: 39,
        size: 0.6,
        weight: 8.5,
        imageUrl: 'charmander'
      },
      {
        name: 'Squirtle', typeId: 3,
        pokedexId: 7,
        lifePoints: 44,
        size: 0.5,
        weight: 9.0,
        imageUrl: 'squirtle'
      },
      {
        name: 'Bulbasaur', typeId: 4,
        pokedexId: 1,
        lifePoints: 45,
        size: 0.7,
        weight: 6.9,
        imageUrl: 'bulbasaur'
      },
      {
        name: 'Jigglypuff', typeId: 1,
        pokedexId: 39,
        lifePoints: 115,
        size: 0.5,
        weight: 5.5,
        imageUrl: 'jigglypuff'
      },
      {
        name: 'Gengar', typeId: 14,
        pokedexId: 94,
        lifePoints: 60,
        size: 1.5,
        weight: 40.5,
        imageUrl: 'gengar'
      },
      {
        name: 'Eevee', typeId: 1,
        pokedexId: 133,
        lifePoints: 55,
        size: 0.3,
        weight: 6.5,
        imageUrl: 'eevee'
      },
      {
        name: 'Snorlax', typeId: 1,
        pokedexId: 143,
        lifePoints: 160,
        size: 2.1,
        weight: 460.0,
        imageUrl: 'snorlax'
      },
      {
        name: 'Dragonite', typeId: 15,
        pokedexId: 149,
        lifePoints: 91,
        size: 2.2,
        weight: 210.0,
        imageUrl: 'dragonite'
      },
      {
        name: 'Mewtwo', typeId: 11,
        pokedexId: 150,
        lifePoints: 106,
        size: 2.0,
        weight: 122.0,
        imageUrl: 'mewtwo'
      }
    ]
  });

  await prisma.user.createMany({
    data: [
      {
        "email": "admin@gmail.com",
        "password": "admin"
      }
    ]
  })


  console.log('Seed completed!');
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
