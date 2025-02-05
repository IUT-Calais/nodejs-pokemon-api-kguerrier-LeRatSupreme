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
    res.status(200).send("La route doit àjouter un pokemon avec un body");
}

export const patchPokemonCardById  = async (_req: express.Request, res: express.Response) => {
    res.status(200).send("permet de modifier le pokémon donc le pokemonCardId est passé en paramètre et les propriétés passées dans le body.")
}

export const deletePokemonCard  = async (_req: express.Request, res: express.Response) => {
    res.status(200).send("ermet de supprimer le pokémon renseigné avec son pokemonCardId")
}