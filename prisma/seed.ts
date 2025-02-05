import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.pokemonCard.deleteMany();
  await prisma.type.deleteMany();

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
        name: "Bulbizarre",
        pokedexId: 1,
        size: 0.7,
        lifePoints: 45,
        weight: 6.9,
        imageUrl: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png",
        typeId: 4,
      }
    ]
  });


  console.log('Seed completed!');
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
