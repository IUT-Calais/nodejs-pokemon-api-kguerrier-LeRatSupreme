import express from 'express';
import prisma from '../client';

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
            return;
        }

        const PokemonCard = await prisma.pokemonCard.findUnique({
            where: { id: pokemonCardId }
        });

        if (!PokemonCard) {
            res.status(404).send({ message: "Carte Pokémon non trouvée." });
            return;
        }

        res.status(200).send(PokemonCard);
    } catch (error) {
        console.error("Erreur lors de la récupération de la carte Pokémon:", error);
        res.status(500).send({ message: "Une erreur est survenue lors de la récupération de la carte Pokémon." });
    }
}

export const postPokemonCard = async (req: express.Request, res: express.Response) => {
    //res.status(42).send({ message: "Tous les champs sont requis." });
    //return;
    try {
        const PokemonCardData = req.body;
        if (!PokemonCardData.name || !PokemonCardData.pokedexId || !PokemonCardData.type || !PokemonCardData.lifePoints) {
            res.status(400).send({ message: "Tous les champs sont requis." });
            return;
        }

        const NewPokemonCard = await prisma.pokemonCard.create({
            data: {
                name: PokemonCardData.name,
                pokedexId: parseInt(PokemonCardData.pokedexId),
                typeId: parseInt(PokemonCardData.type),
                lifePoints: parseInt(PokemonCardData.lifePoints),
            }
        });

        res.status(201).send(NewPokemonCard);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Erreur interne du serveur"});
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

        res.status(204).json(deletedPokemonCard);
    } catch (error) {
        console.error("Erreur lors de la suppression de la carte Pokémon:", error);
        res.status(500).send({ message: "Une erreur est survenue lors de la suppression de la carte Pokémon." });
    }
} //push