import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertDealSchema, insertProjectSchema, insertTaskSchema, insertVendorSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

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

  // Vendors
  app.get("/api/vendors", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const vendors = await storage.getVendors();
    res.json(vendors);
  });

  app.post("/api/vendors", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const result = insertVendorSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json(result.error);
    }
    const vendor = await storage.createVendor(result.data);
    res.status(201).json(vendor);
  });

  // Projects
  app.get("/api/deals/:dealId/projects", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const projects = await storage.getProjects(Number(req.params.dealId));
    res.json(projects);
  });

  app.post("/api/projects", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const result = insertProjectSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json(result.error);
    }
    const project = await storage.createProject(result.data);
    res.status(201).json(project);
  });

  // Tasks
  app.get("/api/projects/:projectId/tasks", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const tasks = await storage.getProjectTasks(Number(req.params.projectId));
    res.json(tasks);
  });

  app.post("/api/tasks", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const result = insertTaskSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json(result.error);
    }
    const task = await storage.createTask(result.data);
    res.status(201).json(task);
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const result = insertTaskSchema.partial().safeParse(req.body);
    if (!result.success) {
      return res.status(400).json(result.error);
    }
    const task = await storage.updateTask(Number(req.params.id), result.data);
    res.json(task);
  });

  const httpServer = createServer(app);
  return httpServer;
}
