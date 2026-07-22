---
name: qa-security
description: Run local-only security scans and classify findings without attacking external systems.
disable-model-invocation: true
---

Security scope: $ARGUMENTS

Run deterministic local SAST, secret scan, software-bill-of-materials, dependency CVE and IaC checks. ZAP baseline may target only the Compose localhost app. Active ZAP requires explicit human request and the isolated local fixture. Redact all credentials. Do not upload source or findings to a commercial service or weaken severity policy.
