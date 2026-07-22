GET http://{{host}}:{{api_port}}/health
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
duration < 2000

POST http://{{host}}:{{api_port}}/auth/login
Content-Type: application/json
{
  "email": "recruiter@talent.test",
  "password": "QaDemo!2026"
}
HTTP 200
[Captures]
token: jsonpath "$.token"
[Asserts]
jsonpath "$.user.role" == "recruiter"

GET http://{{host}}:{{api_port}}/candidates?page=1&pageSize=10&q=alex
Authorization: Bearer {{token}}
HTTP 200
[Asserts]
jsonpath "$.page" == 1
jsonpath "$.pageSize" == 10

POST http://{{host}}:{{api_port}}/candidates
Authorization: Bearer {{token}}
Idempotency-Key: hurl-candidate-001
Content-Type: application/json
{
  "email": "hurl.candidate@example.test",
  "firstName": "Hurl",
  "lastName": "Candidate",
  "location": "Local"
}
HTTP 201
[Captures]
candidate_id: jsonpath "$.id"
candidate_version: jsonpath "$.version"
[Asserts]
jsonpath "$.email" == "hurl.candidate@example.test"

POST http://{{host}}:{{api_port}}/candidates
Authorization: Bearer {{token}}
Idempotency-Key: hurl-candidate-001
Content-Type: application/json
{
  "email": "hurl.candidate@example.test",
  "firstName": "Hurl",
  "lastName": "Candidate",
  "location": "Local"
}
HTTP 200
[Asserts]
header "x-idempotent-replay" == "true"
jsonpath "$.id" == "{{candidate_id}}"

PUT http://{{host}}:{{api_port}}/candidates/{{candidate_id}}
Authorization: Bearer {{token}}
If-Match: {{candidate_version}}
Content-Type: application/json
{
  "email": "hurl.candidate@example.test",
  "firstName": "Updated",
  "lastName": "Candidate",
  "location": "Local"
}
HTTP 200
[Asserts]
jsonpath "$.firstName" == "Updated"
jsonpath "$.version" == 2

POST http://{{host}}:{{api_port}}/candidates
Authorization: Bearer {{token}}
Content-Type: application/json
{
  "email": "not-an-email",
  "firstName": "Bad",
  "lastName": "Input"
}
HTTP 400
[Asserts]
jsonpath "$.error.code" == "VALIDATION_ERROR"

POST http://{{host}}:{{api_port}}/auth/login
Content-Type: application/json
{
  "email": "reviewer@talent.test",
  "password": "QaDemo!2026"
}
HTTP 200
[Captures]
reviewer_token: jsonpath "$.token"

POST http://{{host}}:{{api_port}}/candidates
Authorization: Bearer {{reviewer_token}}
Content-Type: application/json
{
  "email": "forbidden@example.test",
  "firstName": "Forbidden",
  "lastName": "Reviewer"
}
HTTP 403
[Asserts]
jsonpath "$.error.code" == "FORBIDDEN"
