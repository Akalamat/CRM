import { IStorage } from "./types";
import createMemoryStore from "memorystore";
import session from "express-session";
import { User, InsertUser, Deal, InsertDeal } from "@shared/schema";

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
      position: await this.getNextDealPosition(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.deals.set(id, deal);
    return deal;
  }

  private async getNextDealPosition(): Promise<number> {
    const deals = Array.from(this.deals.values());
    return deals.length > 0 ? Math.max(...deals.map(d => d.position)) + 1 : 0;
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

  async updateDealPositions(updates: { id: number; position: number }[]): Promise<void> {
    for (const update of updates) {
      const deal = this.deals.get(update.id);
      if (deal) {
        this.deals.set(update.id, { ...deal, position: update.position });
      }
    }
  }

  async getDeals(): Promise<Deal[]> {
    return Array.from(this.deals.values())
      .sort((a, b) => a.position - b.position);
  }

  async deleteDeal(id: number): Promise<void> {
    this.deals.delete(id);
  }
}

export const storage = new MemStorage();