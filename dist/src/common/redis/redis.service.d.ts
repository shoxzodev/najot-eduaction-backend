export declare class RedisService {
    private readonly logger;
    private storage;
    constructor();
    set(key: string, value: any, ttlSeconds?: number): Promise<void>;
    get(key: string): Promise<any>;
    del(key: string): Promise<void>;
}
