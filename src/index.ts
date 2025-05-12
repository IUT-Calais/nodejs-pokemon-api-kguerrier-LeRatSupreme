import express from 'express';
import PokemonCardRoute from "./PokemonCard/PokemonCard.route";
import UserRoute from "./User/User.route";

import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';


export const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());


export const server = app.listen(port);

export function stopServer() {
  server.close();
}

app.use("/pokemons-cards", PokemonCardRoute);
app.use("/users", UserRoute);

// On charge la spécification Swagger
const swaggerDocument = YAML.load(path.join(__dirname, './swagger.yaml'));
// Et on affecte le Serveur Swagger UI à l'adresse /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


