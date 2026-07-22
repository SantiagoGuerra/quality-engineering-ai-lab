import http from 'k6/http';
import { check } from 'k6';

const api = __ENV.API_BASE_URL || 'http://host.docker.internal:3001';
export const options = {
  vus: 1,
  iterations: 5,
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    http_reqs: ['count>=5'],
  },
};
export default function () { const response = http.get(`${api}/health`); check(response, { 'health is 200': (result) => result.status === 200 }); }
