import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

class InMemoryPrisma {
  private users = new Map<string, Record<string, any>>();
  private otps: Array<Record<string, any>> = [];
  private refreshTokens = new Map<string, Record<string, any>>();
  private userCounter = 1;
  private otpCounter = 1;
  private refreshTokenCounter = 1;
  private modelCounters = new Map<string, number>();
  private stores = new Map<string, Map<string, Record<string, any>>>();
  private connected = false;

  public readonly user = {
    findUnique: async ({ where }: { where: Record<string, any> }) => {
      const record = this.findUser(where);
      return record ? { ...record } : null;
    },
    create: async ({ data }: { data: Record<string, any> }) => {
      const created = {
        id: `mem-user-${this.userCounter++}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...data,
      };
      this.users.set(created.id, created);
      return { ...created };
    },
    update: async ({ where, data }: { where: Record<string, any>; data: Record<string, any> }) => {
      const record = this.findUser(where);
      if (!record) {
        throw new Error('User not found');
      }
      const updated = {
        ...record,
        ...data,
        updatedAt: new Date(),
      };
      this.users.set(record.id, updated);
      return { ...updated };
    },
  };

  public readonly oTP = {
    deleteMany: async ({ where }: { where: Record<string, any> }) => {
      this.otps = this.otps.filter((otp) => !this.matches(where, otp));
      return { count: 0 };
    },
    create: async ({ data }: { data: Record<string, any> }) => {
      const created = {
        id: `mem-otp-${this.otpCounter++}`,
        createdAt: new Date(),
        ...data,
      };
      this.otps.push(created);
      return { ...created };
    },
    findFirst: async ({ where }: { where: Record<string, any> }) => {
      return this.otps.find((otp) => this.matches(where, otp)) || null;
    },
  };

  public readonly refreshToken = {
    create: async ({ data }: { data: Record<string, any> }) => {
      const created: Record<string, any> = {
        id: `mem-refresh-${this.refreshTokenCounter++}`,
        createdAt: new Date(),
        ...data,
      };
      this.refreshTokens.set(created.token, created);
      return { ...created };
    },
    findUnique: async ({ where }: { where: Record<string, any> }) => {
      const token = where?.token;
      if (!token) return null;
      return this.refreshTokens.get(token) ? { ...this.refreshTokens.get(token) } : null;
    },
    deleteMany: async ({ where }: { where: Record<string, any> }) => {
      if (where?.token) {
        this.refreshTokens.delete(where.token);
      }
      return { count: 0 };
    },
  };

  public readonly progress = this.createModel('progress');
  public readonly lesson = this.createModel('lesson');
  public readonly chapter = this.createModel('chapter');
  public readonly roadmap = this.createModel('roadmap');
  public readonly quiz = this.createModel('quiz');
  public readonly quizAttempt = this.createModel('quizAttempt');
  public readonly bookmark = this.createModel('bookmark');
  public readonly userNote = this.createModel('userNote');
  public readonly lessonSection = this.createModel('lessonSection');
  public readonly flashcard = this.createModel('flashcard');
  public readonly question = this.createModel('question');
  public readonly answer = this.createModel('answer');
  public readonly tag = this.createModel('tag');
  public readonly lessonTag = this.createModel('lessonTag');

  public async $connect() {
    this.connected = true;
    return;
  }

  public async seedFallbackUsers() {
    const adminExists = this.findUser({ email: 'admin@devops.local' });
    if (!adminExists) {
      const adminPasswordHash = await bcrypt.hash('Admin123!', 12);
      const adminUser = {
        id: `mem-user-${this.userCounter++}`,
        name: 'Admin',
        email: 'admin@devops.local',
        password: adminPasswordHash,
        verified: true,
        role: 'ADMIN',
        avatar: null,
        streak: 0,
        studyMinutes: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.users.set(adminUser.id, adminUser);
    }

    const userExists = this.findUser({ email: 'user@devops.local' });
    if (!userExists) {
      const passwordHash = await bcrypt.hash('User123!', 12);
      const demoUser = {
        id: `mem-user-${this.userCounter++}`,
        name: 'Demo User',
        email: 'user@devops.local',
        password: passwordHash,
        verified: true,
        role: 'USER',
        avatar: null,
        streak: 0,
        studyMinutes: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      this.users.set(demoUser.id, demoUser);
    }
  }

  public async $disconnect() {
    this.connected = false;
    return;
  }

  private createModel(name: string) {
    const store = new Map<string, Record<string, any>>();
    this.stores.set(name, store);

    return {
      findMany: async ({ where, orderBy, take, skip }: { where?: Record<string, any>; orderBy?: Record<string, string> | Array<Record<string, string>>; take?: number; skip?: number } = {}) => {
        const records = [...store.values()].filter((record) => this.matches(where, record));
        const sorted = this.sortRecords(records, orderBy);
        const start = skip ?? 0;
        const end = take !== undefined ? start + take : undefined;
        return sorted.slice(start, end).map((record) => ({ ...record }));
      },
      findUnique: async ({ where }: { where?: Record<string, any> } = {}) => {
        const record = [...store.values()].find((item) => this.matches(where, item));
        return record ? { ...record } : null;
      },
      findFirst: async ({ where, orderBy }: { where?: Record<string, any>; orderBy?: Record<string, string> | Array<Record<string, string>> } = {}) => {
        const records = [...store.values()].filter((record) => this.matches(where, record));
        const sorted = this.sortRecords(records, orderBy);
        return sorted[0] ? { ...sorted[0] } : null;
      },
      create: async ({ data }: { data: Record<string, any> } = { data: {} }) => {
        const created = {
          id: `${name}-${(this.modelCounters.get(name) ?? 1)}`,
          createdAt: new Date(),
          updatedAt: new Date(),
          ...data,
        };
        this.modelCounters.set(name, (this.modelCounters.get(name) ?? 1) + 1);
        store.set(created.id, created);
        return { ...created };
      },
      update: async ({ where, data }: { where?: Record<string, any>; data: Record<string, any> } = { data: {} }) => {
        const record = [...store.values()].find((item) => this.matches(where, item));
        if (!record) {
          throw new Error(`${name} not found`);
        }
        const updated = {
          ...record,
          ...data,
          updatedAt: new Date(),
        };
        store.set(record.id, updated);
        return { ...updated };
      },
      upsert: async ({ where, create, update }: { where?: Record<string, any>; create?: Record<string, any>; update?: Record<string, any> } = {}) => {
        const existing = await this.createModel(name).findUnique({ where });
        if (existing) {
          return this.createModel(name).update({ where, data: update ?? {} });
        }
        return this.createModel(name).create({ data: create ?? {} });
      },
      deleteMany: async ({ where }: { where?: Record<string, any> } = {}) => {
        for (const [id, record] of Array.from(store.entries())) {
          if (this.matches(where, record)) {
            store.delete(id);
          }
        }
        return { count: 0 };
      },
      delete: async ({ where }: { where?: Record<string, any> } = {}) => {
        for (const [id, record] of Array.from(store.entries())) {
          if (this.matches(where, record)) {
            store.delete(id);
            return { id };
          }
        }
        return null;
      },
      count: async ({ where }: { where?: Record<string, any> } = {}) => {
        return [...store.values()].filter((record) => this.matches(where, record)).length;
      },
    };
  }

  private findUser(where: Record<string, any>) {
    for (const record of this.users.values()) {
      if (this.matches(where, record)) {
        return record;
      }
    }
    return null;
  }

  private cloneRecord(record: Record<string, any>) {
    return { ...record };
  }

  private sortRecords(records: Record<string, any>[], orderBy?: Record<string, string> | Array<Record<string, string>>) {
    const sorted = [...records];
    if (!orderBy) {
      return sorted;
    }

    const criteria = Array.isArray(orderBy) ? orderBy : [orderBy];
    sorted.sort((a, b) => {
      for (const rule of criteria) {
        const [field, direction] = Object.entries(rule)[0] ?? [];
        if (!field) {
          continue;
        }
        const left = a[field];
        const right = b[field];
        if (left === right) {
          continue;
        }
        const result = left > right ? 1 : -1;
        return direction === 'desc' ? -result : result;
      }
      return 0;
    });

    return sorted;
  }

  private matches(where: Record<string, any> | undefined, record: Record<string, any>) {
    if (!where) {
      return true;
    }

    return Object.entries(where).every(([key, value]) => {
      if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        const nestedEntries = Object.entries(value as Record<string, unknown>);
        const compositeMatch = nestedEntries.every(([nestedKey, nestedValue]) => {
          if (nestedKey === 'mode' || nestedKey === 'contains' || nestedKey === 'startsWith' || nestedKey === 'endsWith') {
            return true;
          }

          return this.matchValue(record[nestedKey], nestedValue);
        });

        if (record[key] === undefined && nestedEntries.some(([nestedKey]) => nestedKey !== 'mode')) {
          return compositeMatch;
        }

        return this.matchValue(record[key], value);
      }

      return this.matchValue(record[key], value);
    });
  }

  private matchValue(recordValue: unknown, expectedValue: unknown) {
    if (expectedValue && typeof expectedValue === 'object' && !Array.isArray(expectedValue) && !(expectedValue instanceof Date)) {
      return Object.entries(expectedValue as Record<string, unknown>).every(([operator, opValue]) => {
        const expected = opValue as number | string | Date | Array<unknown>;
        switch (operator) {
          case 'gt':
            return (recordValue as number | Date) > (expected as number | Date);
          case 'gte':
            return (recordValue as number | Date) >= (expected as number | Date);
          case 'lt':
            return (recordValue as number | Date) < (expected as number | Date);
          case 'lte':
            return (recordValue as number | Date) <= (expected as number | Date);
          case 'in':
            return Array.isArray(expected) ? expected.includes(recordValue) : false;
          case 'contains':
            return typeof recordValue === 'string' && typeof expected === 'string' && recordValue.toLowerCase().includes(expected.toLowerCase());
          case 'startsWith':
            return typeof recordValue === 'string' && typeof expected === 'string' && recordValue.toLowerCase().startsWith(expected.toLowerCase());
          case 'endsWith':
            return typeof recordValue === 'string' && typeof expected === 'string' && recordValue.toLowerCase().endsWith(expected.toLowerCase());
          default:
            return false;
        }
      });
    }

    if (expectedValue instanceof Date || recordValue instanceof Date) {
      return new Date(recordValue as string | number | Date).getTime() === new Date(expectedValue as string | number | Date).getTime();
    }

    return recordValue === expectedValue;
  }
}

const realPrisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});
const memoryPrisma = new InMemoryPrisma();

export let prisma: any = realPrisma;

export async function connectPrisma() {
  try {
    await realPrisma.$connect();
    prisma = realPrisma;
    return true;
  } catch (error) {
    console.warn('Database unavailable, using in-memory auth fallback:', error);
    prisma = memoryPrisma;
    await prisma.$connect();
    await prisma.seedFallbackUsers();
    return false;
  }
}
