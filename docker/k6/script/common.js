import http from "k6/http";

const baseUrl = __ENV.BASE_URL || "http://localhost:3000";

export function apiGet(path) {
    return http.get(`${baseUrl}${path}`);
}
