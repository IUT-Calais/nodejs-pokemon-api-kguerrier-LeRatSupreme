import express from 'express';
import {getPokemonCard, getPokemonCardById, postPokemonCard, patchPokemonCardById, deletePokemonCard} from "./PokemonCard.controller";

const router = express();

router.get('/', getPokemonCard)

router.get('/:pokemonCardId', getPokemonCardById)

router.post('/', postPokemonCard)

router.patch('/:pokemonCardId', patchPokemonCardById)

router.delete('/:pokemonCardId', deletePokemonCard)

export default router;