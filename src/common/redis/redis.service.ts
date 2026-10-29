import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class RedisService {
    private readonly logger = new Logger(RedisService.name);
    private storage = new Map<string, { value: any; expiresAt?: number }>();

    constructor() {
        this.logger.log("In-memory cache initialized (Redis connection disabled)");
    }

    async set(key: string, value: any, ttlSeconds: number = 120): Promise<void> {
        this.storage.set(key, {
            value,
            expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined,
        });
    }

    async get(key: string): Promise<any> {
        const item = this.storage.get(key);
        if (!item) {
            return null;
        }

        if (item.expiresAt && Date.now() > item.expiresAt) {
            this.storage.delete(key);
            return null;
        }

        return item.value;
    }

    async del(key: string): Promise<void> {
        this.storage.delete(key);
    }
}
