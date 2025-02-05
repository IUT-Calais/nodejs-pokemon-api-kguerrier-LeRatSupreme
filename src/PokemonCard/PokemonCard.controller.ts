import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getPokemonCard = async (_req: express.Request, res: express.Response) => {
    try {
        const PokemonCard = await prisma.pokemonCard.findMany();
        res.status(200).send(PokemonCard);
    } catch (error) {
        console.error('Erreur lors de la récupération des cartes Pokémon:', error);
        res.status(500).send({ message: 'Une erreur est survenue lors de la récupération des cartes Pokémon' });
    }
}

export const getPokemonCardById = async (_req: express.Request, res: express.Response) => {
    try {
        const pokemonCardId = parseInt(_req.params.pokemonCardId);

        if (isNaN(pokemonCardId)) {
            res.status(400).send({ message: "L'ID du Pokémon est invalide." });
        }

        const PokemonCard = await prisma.pokemonCard.findFirst({
            where: { id: pokemonCardId }
        });

        if (!PokemonCard) {
            res.status(404).send({ message: "Carte Pokémon non trouvée." });
        }

        res.status(200).send(PokemonCard);
    } catch (error) {
        console.error("Erreur lors de la récupération de la carte Pokémon:", error);
        res.status(500).send({ message: "Une erreur est survenue lors de la récupération de la carte Pokémon." });
    }
}

export const postPokemonCard = async (_req: express.Request, res: express.Response) => {
    try {
        const PokemonCardData = _req.body;

        if (!PokemonCardData.name || !PokemonCardData.pokedexId || !PokemonCardData.type || !PokemonCardData.lifePoints) {
            res.status(400).json({ message: "Tous les champs sont requis." });
        }

        const NewPokemonCard = await prisma.pokemonCard.create({
            data: {
                name: PokemonCardData.name,
                pokedexId: parseInt(PokemonCardData.pokedexId),
                typeId: parseInt(PokemonCardData.type),
                lifePoints: parseInt(PokemonCardData.lifePoints),
            }
        });

        res.status(201).json(NewPokemonCard);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur interne du serveur"});
    }
}

export const patchPokemonCardById  = async (_req: express.Request, res: express.Response) => {
    try {
        const pokemonCardId = parseInt(_req.params.pokemonCardId);

        if (isNaN(pokemonCardId)) {
            res.status(400).send({ message: "L'ID du Pokémon est invalide." });
        }

        const { name, typeId, pokedexId, lifePoints, size, weight, imageUrl } = _req.body;

        if (!name || !typeId || !pokedexId || !lifePoints) {
            res.status(400).json({ message: "Tous les champs sont requis." });
        }

        const updatedPokemonCard = await prisma.pokemonCard.update({
            where: { id: pokemonCardId },
            data: { name, typeId, pokedexId, lifePoints, size, weight, imageUrl },
        });

        res.status(200).json(updatedPokemonCard);
    } catch (error) {
        console.error("Erreur lors de la mise à jour de la carte Pokémon:", error);
        res.status(500).send({ message: "Une erreur est survenue lors de la mise à jour de la carte Pokémon." });
    }
}

export const deletePokemonCard  = async (_req: express.Request, res: express.Response) => {
    try {
        const pokemonCardId = parseInt(_req.params.pokemonCardId);

        if (isNaN(pokemonCardId)) {
            res.status(400).send({ message: "L'ID du Pokémon est invalide." });
        }

        const deletedPokemonCard = await prisma.pokemonCard.delete({
            where: { id: pokemonCardId }
        });

        res.status(200).json(deletedPokemonCard);
    } catch (error) {
        console.error("Erreur lors de la suppression de la carte Pokémon:", error);
        res.status(500).send({ message: "Une erreur est survenue lors de la suppression de la carte Pokémon." });
    }
}