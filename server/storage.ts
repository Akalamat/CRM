import { IStorage } from "./types";
import createMemoryStore from "memorystore";
import session from "express-session";
import {
  User,
  InsertUser,
  Deal,
  InsertDeal,
  Vendor,
  InsertVendor,
  Project,
  InsertProject,
  Task,
  InsertTask,
} from "@shared/schema";

const MemoryStore = createMemoryStore(session);

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private deals: Map<number, Deal>;
  private vendors: Map<number, Vendor>;
  private projects: Map<number, Project>;
  private tasks: Map<number, Task>;
  readonly sessionStore: session.Store;
  private currentIds: {
    users: number;
    deals: number;
    vendors: number;
    projects: number;
    tasks: number;
  };

  constructor() {
    this.users = new Map();
    this.deals = new Map();
    this.vendors = new Map();
    this.projects = new Map();
    this.tasks = new Map();
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
    this.currentIds = {
      users: 1,
      deals: 1,
      vendors: 1,
      projects: 1,
      tasks: 1,
    };
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentIds.users++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Deal methods
  async createDeal(insertDeal: InsertDeal): Promise<Deal> {
    const id = this.currentIds.deals++;
    const deal = {
      ...insertDeal,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.deals.set(id, deal);
    return deal;
  }

  async updateDeal(id: number, deal: Partial<InsertDeal>): Promise<Deal> {
    const existingDeal = this.deals.get(id);
    if (!existingDeal) throw new Error("Deal not found");
    
    const updatedDeal = {
      ...existingDeal,
      ...deal,
      updatedAt: new Date(),
    };
    this.deals.set(id, updatedDeal);
    return updatedDeal;
  }

  async getDeals(): Promise<Deal[]> {
    return Array.from(this.deals.values());
  }

  // Vendor methods
  async createVendor(insertVendor: InsertVendor): Promise<Vendor> {
    const id = this.currentIds.vendors++;
    const vendor = { ...insertVendor, id };
    this.vendors.set(id, vendor);
    return vendor;
  }

  async getVendors(): Promise<Vendor[]> {
    return Array.from(this.vendors.values());
  }

  // Project methods
  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentIds.projects++;
    const project = { ...insertProject, id };
    this.projects.set(id, project);
    return project;
  }

  async getProjects(dealId: number): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(
      (project) => project.dealId === dealId
    );
  }

  // Task methods
  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.currentIds.tasks++;
    const task = { ...insertTask, id };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: number, task: Partial<InsertTask>): Promise<Task> {
    const existingTask = this.tasks.get(id);
    if (!existingTask) throw new Error("Task not found");
    
    const updatedTask = {
      ...existingTask,
      ...task,
    };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async getProjectTasks(projectId: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(
      (task) => task.projectId === projectId
    );
  }
}

export const storage = new MemStorage();
