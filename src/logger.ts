import process from "node:process";

import pino from "pino";

export const logger = pino(
    {
        messageKey: "message",
        errorKey: "error",
        timestamp: pino.stdTimeFunctions.isoTime,
        formatters: {
            level(label) {
                return { level: label };
            },
            bindings(_bindings) {
                return {};
            },
        },
    },
    process.stdout,
);
