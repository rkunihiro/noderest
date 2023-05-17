import { Redis } from "ioredis";

const uri = "redis://localhost:6379";

export const redis = new Redis(uri, {
    retryStrategy(times) {
        return Math.min(times * 50, 2000);
    },
    commandTimeout: 5000,
    maxRetriesPerRequest: 1,
    reconnectOnError() {
        return false;
    },
    connectTimeout: 5000,
});
