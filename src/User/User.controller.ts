import express from 'express';
import b from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../client';

export const createUser = async (_req: express.Request, res: express.Response): Promise<void> => {
    try {
        const UserData = _req.body;

        if (!UserData.email || !UserData.password) {
            res.status(400).json({ message: "Tous les champs sont requis." });
            return;
        }

        const salt = await b.genSalt();
        const hashedPassword = await b.hash(UserData.password, salt);

        const NewUser = await prisma.user.create({
            data: {
                email: UserData.email,
                password: hashedPassword,
            }
        });

        const token = jwt.sign(
            { userId: NewUser.id, email: NewUser.email }, // Payload
            process.env.JWT_SECRET as jwt.Secret, // Secret
            { expiresIn: process.env.JWT_EXPIRES_IN } // Expiration
        );

        res.status(201).json({ user: NewUser, token });
    } catch (error: any) {
        console.error(error);

        // Vérifiez si l'erreur est une violation d'unicité (P2002)
        if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
            res.status(400).json({ message: "Utilisateur déjà existant." });
        } else {
            res.status(500).json({ message: "Erreur interne du serveur." });
        }
    }
};

export const loginUser = async (_req: express.Request, res: express.Response): Promise<void> => {
    try {
        const { email, password } = _req.body;

        if (!email || !password) {
            res.status(400).json({ message: "Tous les champs sont requis." });
            return;
        }

        // Validation du format de l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({ message: "Format de l'email invalide." });
            return;
        }

        const userFetched = await prisma.user.findFirst({
            where: { email: email },
        });

        if (!userFetched) {
            res.status(404).json({ message: "Utilisateur non trouvé." });
            return;
        }

        const isPasswordValid = await b.compare(password, userFetched.password);

        if (!isPasswordValid) {
            res.status(400).json({ message: "Mot de passe incorrect." });
            return;
        }

        const token = jwt.sign(
            { userId: userFetched.id, email: userFetched.email },
            process.env.JWT_SECRET as jwt.Secret,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(200).json({ message: "Connexion réussie.", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
};

export const getUsers = async (_req: express.Request, res: express.Response): Promise<void> => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
};

export const getUserById = async (_req: express.Request, res: express.Response): Promise<void> => {
    try {
        const userId = parseInt(_req.params.userId);

        if (isNaN(userId)) {
            res.status(400).json({ message: "L'ID de l'utilisateur est invalide." });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            res.status(404).json({ message: "Utilisateur non trouvé." });
            return;
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
};

export const updateUserById = async (_req: express.Request, res: express.Response): Promise<void> => {
    try {
        const userId = parseInt(_req.params.userId);

        if (isNaN(userId)) {
            res.status(400).json({ message: "L'ID de l'utilisateur est invalide." });
            return;
        }

        const { email, password } = _req.body;

        if (!email && !password) {
            res.status(400).json({ message: "Au moins un champ doit être fourni pour la mise à jour." });
            return;
        }

        const updatedData: any = {};
        if (email) updatedData.email = email;
        if (password) {
            const salt = await b.genSalt();
            updatedData.password = await b.hash(password, salt);
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updatedData,
        });

        res.status(200).json(updatedUser);
    } catch (error: any) {
        console.error(error);

        if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
            res.status(400).json({ message: "Email déjà utilisé." });
        } else {
            res.status(500).json({ message: "Erreur interne du serveur." });
        }
    }
};

export const deleteUserById = async (_req: express.Request, res: express.Response): Promise<void> => {
    try {
        const userId = parseInt(_req.params.userId);

        if (isNaN(userId)) {
            res.status(400).json({ message: "L'ID de l'utilisateur est invalide." });
            return;
        }

        await prisma.user.delete({
            where: { id: userId },
        });

        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
};