import http from 'k6/http';
const api = __ENV.API_BASE_URL || 'http://host.docker.internal:3001';
export const options = { stages: [{ duration: '3s', target: 2 }, { duration: '2s', target: 30 }, { duration: '5s', target: 30 }, { duration: '3s', target: 0 }], thresholds: { http_req_failed: ['rate<0.03'], http_req_duration: ['p(95)<1200', 'p(99)<2000'] } };
export default function () { http.get(`${api}/health`); }
