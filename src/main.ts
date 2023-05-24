import process from "node:process";

import { logger } from "./logger";
import { server } from "./server";

export async function main() {
    const url = await server.listen({
        host: "0.0.0.0",
        port: 3000,
    });
    logger.info(`Server start ${url}`);

    return new Promise<void>((resolve) => {
        const shutdown = async (signal: NodeJS.Signals) => {
            logger.info(`Server close by ${signal}`);
            await server.close();
            logger.info(`Server closed`);
            resolve();
        };
        process.on("SIGINT", shutdown);
        process.on("SIGTERM", shutdown);
    });
}

main().then(() => {
    process.exit(0);
});
