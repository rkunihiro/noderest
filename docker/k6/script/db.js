import { check } from "k6";

import { apiGet } from "./common.js";
export { options } from "./options.js";

export default function dbTest() {
    const res = apiGet("/db");
    check(res, {
        "status:200": (r) => {
            return r.status == 200;
        },
    });
}
