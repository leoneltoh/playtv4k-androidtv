import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import cors from 'cors';
import { db } from "../db";
import { users, channels, programs } from "../db/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware d'authentification
const authenticate = async (req: Request, res: Response, next: Function) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token manquant' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
    const user = await db.query.users.findFirst({
      where: eq(users.id, decoded.id)
    });

    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    (req as any).user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalide' });
  }
};

export function registerRoutes(app: Express): Server {
  app.use(cors());

  // Routes d'authentification
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const [user] = await db.insert(users).values({
        username,
        password: hashedPassword,
        role: 'owner'
      }).returning();

      const token = jwt.sign({ id: user.id }, JWT_SECRET);
      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de l\'inscription' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await db.query.users.findFirst({
        where: eq(users.username, username)
      });

      if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(401).json({ message: 'Identifiants invalides' });
      }

      const token = jwt.sign({ id: user.id }, JWT_SECRET);
      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la connexion' });
    }
  });

  // Proxy endpoint for M3U file
  app.get('/api/channels', async (req, res) => {
    try {
      const response = await fetch('https://terranovision.replit.app/terranochannel.m3u', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const content = await response.text();
      res.setHeader('Content-Type', 'text/plain');
      res.send(content);
    } catch (error) {
      console.error('Error fetching M3U:', error);
      res.status(500).json({ error: 'Erreur lors du chargement des chaînes' });
    }
  });

  // Routes pour la gestion des programmes
  app.get('/api/channels/:channelId/programs', async (req, res) => {
    try {
      const { channelId } = req.params;
      const { start, end } = req.query;

      const programsList = await db.query.programs.findMany({
        where: and(
          eq(programs.channelId, parseInt(channelId)),
          gte(programs.startTime, new Date(start as string)),
          lte(programs.endTime, new Date(end as string))
        ),
        orderBy: programs.startTime
      });

      res.json(programsList);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des programmes' });
    }
  });

  // Routes protégées pour la gestion des programmes (propriétaires de chaînes)
  app.post('/api/channels/:channelId/programs', authenticate, async (req, res) => {
    try {
      const { channelId } = req.params;
      const { title, description, startTime, endTime, category, thumbnail } = req.body;

      // Vérifier que l'utilisateur est propriétaire de la chaîne
      const channel = await db.query.channels.findFirst({
        where: and(
          eq(channels.id, parseInt(channelId)),
          eq(channels.ownerId, (req as any).user.id)
        )
      });

      if (!channel) {
        return res.status(403).json({ message: 'Accès non autorisé à cette chaîne' });
      }

      const [program] = await db.insert(programs).values({
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        category,
        thumbnail,
        channelId: parseInt(channelId)
      }).returning();

      res.json(program);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la création du programme' });
    }
  });

  // Mise à jour d'un programme
  app.put('/api/programs/:programId', authenticate, async (req, res) => {
    try {
      const { programId } = req.params;
      const updateData = req.body;

      // Vérifier que l'utilisateur est propriétaire de la chaîne
      const program = await db.query.programs.findFirst({
        where: eq(programs.id, parseInt(programId)),
        with: {
          channel: true
        }
      });

      if (!program || program.channel.ownerId !== (req as any).user.id) {
        return res.status(403).json({ message: 'Accès non autorisé à ce programme' });
      }

      const [updatedProgram] = await db.update(programs)
        .set(updateData)
        .where(eq(programs.id, parseInt(programId)))
        .returning();

      res.json(updatedProgram);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la mise à jour du programme' });
    }
  });

  // Suppression d'un programme
  app.delete('/api/programs/:programId', authenticate, async (req, res) => {
    try {
      const { programId } = req.params;

      // Vérifier que l'utilisateur est propriétaire de la chaîne
      const program = await db.query.programs.findFirst({
        where: eq(programs.id, parseInt(programId)),
        with: {
          channel: true
        }
      });

      if (!program || program.channel.ownerId !== (req as any).user.id) {
        return res.status(403).json({ message: 'Accès non autorisé à ce programme' });
      }

      await db.delete(programs).where(eq(programs.id, parseInt(programId)));
      res.json({ message: 'Programme supprimé avec succès' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la suppression du programme' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
