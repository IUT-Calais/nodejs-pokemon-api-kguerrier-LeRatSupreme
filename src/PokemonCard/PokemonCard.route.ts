import { Router } from 'express';
import {verifyJWT} from "../common/jwt.middleware";
import {getPokemonCard, getPokemonCardById, postPokemonCard, patchPokemonCardById, deletePokemonCard} from "./PokemonCard.controller";

const router = Router();

router.get('/', getPokemonCard)

router.get('/:pokemonCardId', getPokemonCardById)

router.post('/', verifyJWT, postPokemonCard)

router.patch('/:pokemonCardId', verifyJWT, patchPokemonCardById)

router.delete('/:pokemonCardId', verifyJWT, deletePokemonCard)

export default router;