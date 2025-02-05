import express from 'express';
import PokemonCardRoute from "./PokemonCard/PokemonCard.route"; // Import du fichier des routes

export const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

export const server = app.listen(port);

export function stopServer() {
  server.close();
}

PokemonCardRoute.use("/PokemonCard", PokemonCardRoute);
