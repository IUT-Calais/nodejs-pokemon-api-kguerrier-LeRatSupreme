import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getPokemonCard = async (_req: express.Request, res: express.Response) => {
    const PokemonCard = await prisma.pokemonCard.findMany();

    res.status(200).send(PokemonCard);
}

export const getPokemonCardById = async (_req: express.Request, res: express.Response) => {
    const PokemonCard = await prisma.pokemonCard.findFirst({
        where: {
            pokedexId : parseInt(_req.params.pokemonCardId)
        }
    });

    res.status(200).send(PokemonCard);
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
    res.status(200).send("permet de modifier le pokémon donc le pokemonCardId est passé en paramètre et les propriétés passées dans le body.")
}

export const deletePokemonCard  = async (_req: express.Request, res: express.Response) => {
    res.status(200).send("Permet de supprimer le pokémon renseigné avec son pokemonCardId")
}