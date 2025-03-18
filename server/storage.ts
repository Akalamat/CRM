import { IStorage } from "./types";
import createMemoryStore from "memorystore";
import session from "express-session";
import fs from 'fs';
import path from 'path';
import {
  User,
  InsertUser,
  Deal,
  InsertDeal,
} from "@shared/schema";

const MemoryStore = createMemoryStore(session);
const STORAGE_PATH = "D:\\New folder\\DH\\HK7\\attmdt\\ck3\\storage";

// Đảm bảo thư mục tồn tại
if (!fs.existsSync(STORAGE_PATH)) {
  fs.mkdirSync(STORAGE_PATH, { recursive: true });
}

export class FileStorage implements IStorage {
  private usersFile: string;
  private dealsFile: string;
  readonly sessionStore: session.Store;
  private currentIds: {
    users: number;
    deals: number;
  };

  constructor() {
    this.usersFile = path.join(STORAGE_PATH, 'users.json');
    this.dealsFile = path.join(STORAGE_PATH, 'deals.json');
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });

    // Khởi tạo file nếu chưa tồn tại
    if (!fs.existsSync(this.usersFile)) {
      fs.writeFileSync(this.usersFile, '[]');
    }
    if (!fs.existsSync(this.dealsFile)) {
      fs.writeFileSync(this.dealsFile, '[]');
    }

    // Đọc ID hiện tại
    const users = this.readJsonFile<User[]>(this.usersFile);
    const deals = this.readJsonFile<Deal[]>(this.dealsFile);

    this.currentIds = {
      users: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      deals: deals.length > 0 ? Math.max(...deals.map(d => d.id)) + 1 : 1,
    };
  }

  private readJsonFile<T>(filePath: string): T {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as T;
  }

  private writeJsonFile<T>(filePath: string, data: T): void {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const users = this.readJsonFile<User[]>(this.usersFile);
    return users.find(user => user.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const users = this.readJsonFile<User[]>(this.usersFile);
    return users.find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const users = this.readJsonFile<User[]>(this.usersFile);
    const id = this.currentIds.users++;
    const user = { ...insertUser, id };
    users.push(user);
    this.writeJsonFile(this.usersFile, users);
    return user;
  }

  // Deal methods
  async createDeal(insertDeal: InsertDeal): Promise<Deal> {
    const deals = this.readJsonFile<Deal[]>(this.dealsFile);
    const id = this.currentIds.deals++;
    const deal = {
      ...insertDeal,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    deals.push(deal);
    this.writeJsonFile(this.dealsFile, deals);
    return deal;
  }

  async updateDeal(id: number, dealUpdate: Partial<InsertDeal>): Promise<Deal> {
    const deals = this.readJsonFile<Deal[]>(this.dealsFile);
    const dealIndex = deals.findIndex(d => d.id === id);
    if (dealIndex === -1) throw new Error("Deal not found");

    const updatedDeal = {
      ...deals[dealIndex],
      ...dealUpdate,
      updatedAt: new Date(),
    };
    deals[dealIndex] = updatedDeal;
    this.writeJsonFile(this.dealsFile, deals);
    return updatedDeal;
  }

  async deleteDeal(id: number): Promise<void> {
    const deals = this.readJsonFile<Deal[]>(this.dealsFile);
    const newDeals = deals.filter(d => d.id !== id);
    if (newDeals.length === deals.length) throw new Error("Deal not found");
    this.writeJsonFile(this.dealsFile, newDeals);
  }

  async getDeals(): Promise<Deal[]> {
    return this.readJsonFile<Deal[]>(this.dealsFile);
  }
}

export const storage = new FileStorage();