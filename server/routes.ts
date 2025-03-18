import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertDealSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Contributors
  app.post("/api/contributors/:id/image", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const image = req.body.image;
    if (!image) return res.status(400).send("No image provided");
    
    try {
      await storage.saveContributorImage(req.params.id, image);
      res.sendStatus(200);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  app.get("/api/contributors/:id/image", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const image = await storage.getContributorImage(req.params.id);
      res.json({ image });
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  // Deals
  app.get("/api/deals", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const deals = await storage.getDeals();
    res.json(deals);
  });

  app.post("/api/deals", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const result = insertDealSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json(result.error);
    }
    const deal = await storage.createDeal(result.data);
    res.status(201).json(deal);
  });

  app.patch("/api/deals/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const result = insertDealSchema.partial().safeParse(req.body);
    if (!result.success) {
      return res.status(400).json(result.error);
    }
    const deal = await storage.updateDeal(Number(req.params.id), result.data);
    res.json(deal);
  });

  app.delete("/api/deals/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    await storage.deleteDeal(Number(req.params.id));
    res.sendStatus(204);
  });

  const httpServer = createServer(app);
  return httpServer;
}