import { randomUUID } from "node:crypto";

import fastify from "fastify";

import { database } from "./client/database";
import { kms } from "./client/kms";
import { redis } from "./client/redis";
import { s3 } from "./client/s3";
import { logger } from "./logger";

export const server = fastify({
    logger,
    genReqId() {
        return randomUUID();
    },
});

server.get("/", async (req, res) => {
    const log = req.log.child({ module: "status" });
    log.info("status");
    res.send("OK");
});

server.get("/db", async (req, res) => {
    const log = req.log.child({ module: "db" });
    const users = await database.select("SELECT id,name FROM User ORDER BY id ASC");
    log.info({ data: users });
    res.send(users);
});

server.get("/kms", async (req, res) => {
    const log = req.log.child({ module: "kms" });
    const plaintext = "Hello, World!";
    const ciphertext = await kms.encrypt(plaintext);
    const decrypted = await kms.decrypt(ciphertext);
    log.info({ ciphertext, decrypted });
    res.send({ plaintext, ciphertext, decrypted });
});

server.get("/redis", async (req, res) => {
    const log = req.log.child({ module: "redis" });
    const json = await redis.get("count");
    const data = JSON.parse(json ?? "{}");
    const count = (data.count ?? 0) + 1;
    redis.setex("count", 300, JSON.stringify({ count }));
    log.info({ count });
    res.send({ count });
});

server.get("/s3", async (req, res) => {
    const log = req.log.child({ module: "s3" });
    const bucket = "test-bucket";
    const key = `${new Date().getTime()}.txt`;
    const body = new Date().toISOString();
    await s3.put(bucket, key, body);
    const data = await s3.get(bucket, key);
    log.info({ key, data });
    res.send({ data });
});
