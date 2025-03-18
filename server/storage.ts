import { IStorage } from "./types";
import createMemoryStore from "memorystore";
import session from "express-session";
import {
  User,
  InsertUser,
  Deal,
  InsertDeal,
} from "@shared/schema";

const MemoryStore = createMemoryStore(session);

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private deals: Map<number, Deal>;
  readonly sessionStore: session.Store;
  private currentIds: {
    users: number;
    deals: number;
  };

  constructor() {
    this.users = new Map();
    this.deals = new Map();
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
    this.currentIds = {
      users: 1,
      deals: 1,
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

  async deleteDeal(id: number): Promise<void> {
    if (!this.deals.has(id)) throw new Error("Deal not found");
    this.deals.delete(id);
  }

  async getDeals(): Promise<Deal[]> {
    return Array.from(this.deals.values());
  }
}

export const storage = new MemStorage();