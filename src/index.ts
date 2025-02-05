import express from 'express';
import PokemonCardRoute from "./PokemonCard/PokemonCard.route";

export const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

export const server = app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});

export function stopServer() {
  server.close();
}

app.use("/pokemons-cards", PokemonCardRoute);


