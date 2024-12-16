import type { Express } from "express";
import { createServer, type Server } from "http";
import cors from 'cors';

export function registerRoutes(app: Express): Server {
  // Enable CORS for all routes
  app.use(cors());

  // Proxy endpoint for M3U file
  app.get('/api/channels', async (req, res) => {
    try {
      const response = await fetch('https://liste-des-chaines-m-3-u-graceafrica2.replit.app/playtv.m3u', {
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

  const httpServer = createServer(app);
  return httpServer;
}
