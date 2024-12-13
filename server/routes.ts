import type { Express } from "express";
import { createServer, type Server } from "http";

export function registerRoutes(app: Express): Server {
  // Proxy endpoint for M3U file if needed
  app.get('/api/channels', async (req, res) => {
    try {
      const response = await fetch('https://terranovision.replit.app/terranochannel.m3u');
      const content = await response.text();
      res.send(content);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors du chargement des chaînes' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
