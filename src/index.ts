import express from 'express';
import PokemonCardRoute from "./PokemonCard/PokemonCard.route";
import UserRoute from "./User/User.route";

export const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());


export const server = app.listen(port);

export function stopServer() {
  server.close();
}

app.use("/pokemons-cards", PokemonCardRoute);
app.use("/users", UserRoute);


