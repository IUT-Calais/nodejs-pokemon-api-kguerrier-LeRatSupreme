import express from 'express';
import b from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createUser = async (_req: express.Request, res: express.Response) => {
    try {
        const UserData = _req.body;
        const salt = await b.genSalt();

        if (!UserData.email || !UserData.password) {
            res.status(400).json({ message: "Tous les champs sont requis." });
        }

        const hashedPassword = await b.hash(UserData.password, salt);

        const NewUser = await prisma.user.create({
            data: {
                email: UserData.email,
                password : hashedPassword,
            }
        });

        res.status(201).json(NewUser);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Utilisateur déja existant"});
    }
}

export const loginUser = async (_req: express.Request, res: express.Response) => {
    try {
        const { email, password } = _req.body;

        if (!email || !password) {
            res.status(400).json({ message: "Tous les champs sont requis." });
        }

        // Chercher l'utilisateur par email
        const userFetched = await prisma.user.findFirst({
            where: { email: email },
        });

        if (!userFetched || userFetched === null) {
            res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        const isPasswordValid = await b.compare(password, userFetched!.password);

        if (!isPasswordValid) {
            res.status(400).json({ message: "Mot de passe incorrect." });
        }

        const token = jwt.sign(
            { userId: userFetched!.id, email: userFetched!.email },
            process.env.JWT_SECRET as jwt.Secret,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(201).json({ message: "Connexion réussie.", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
}