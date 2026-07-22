import http from 'k6/http';
const api = __ENV.API_BASE_URL || 'http://host.docker.internal:3001';
export const options = { stages: [{ duration: '5s', target: 5 }, { duration: '10s', target: 20 }, { duration: '5s', target: 0 }], thresholds: { http_req_failed: ['rate<0.02'], http_req_duration: ['p(95)<1000', 'p(99)<1800'] } };
export default function () { http.get(`${api}/health`); }
