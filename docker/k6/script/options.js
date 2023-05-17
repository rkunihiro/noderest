/** @type {import("k6/options").Options} */
export const options = {
    scenarios: {
        default: {
            executor: "constant-arrival-rate",
            duration: "10s",
            rate: 50,
            timeUnit: "1s",
            preAllocatedVUs: 100,
            maxVUs: 200,
        },
    },
};
