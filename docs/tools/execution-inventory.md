# Inventario de ejecución

Estado al 2026-07-21. “No instalada” significa que fue evaluada deliberadamente y no aumenta el supply chain del laboratorio. Los motivos y alternativas están en la [matriz comparativa](evaluation-matrix.md).

| Herramienta           | Instalada      | Configurada | Ejecutada                | Resultado                               | Gate                | Responsable   |
| --------------------- | -------------- | ----------- | ------------------------ | --------------------------------------- | ------------------- | ------------- |
| Turborepo             | Sí             | Sí          | Sí                       | PASS                                    | PR                  | DevEx         |
| Nx                    | No             | No          | No                       | Hold                                    | Ninguno             | DevEx         |
| Vitest                | Sí             | Sí          | Sí                       | PASS                                    | PR                  | Dev           |
| Jest                  | No             | No          | No                       | Reject                                  | Ninguno             | Dev           |
| Testing Library       | Sí             | Sí          | Sí                       | PASS                                    | PR                  | Frontend      |
| Storybook             | Sí             | Sí          | Sí                       | Build PASS                              | PR                  | UI            |
| Playwright            | Sí             | Sí          | Sí                       | 55/55 full; 4/4 smoke; 7 goldens por SO | PR/Main             | QA            |
| Cypress               | No             | No          | No                       | Hold                                    | Ninguno             | QA            |
| WebdriverIO           | No             | No          | No                       | Hold                                    | Ninguno             | QA            |
| fast-check            | Sí             | Sí          | Sí                       | 7/7 PASS                                | PR/Nightly          | Dev           |
| StrykerJS             | Sí             | Sí          | Sí                       | 100%, 9/9 killed                        | Nightly             | QA            |
| axe-core              | Sí             | Sí          | Sí                       | producto 0 violaciones                  | PR                  | Accessibility |
| Pa11y CI              | Sí             | Sí          | Sí                       | 0 errores                               | Nightly             | Accessibility |
| Lighthouse CI         | Sí             | Sí          | Sí                       | PASS                                    | Nightly señal       | WebPerf       |
| Lost Pixel            | No             | No          | No                       | Trial evaluado                          | Ninguno             | QA            |
| Loki                  | No             | No          | No                       | Hold                                    | Ninguno             | UI            |
| BackstopJS            | No             | No          | No                       | Reject                                  | Ninguno             | QA            |
| Hurl                  | Sí             | Sí          | Sí                       | 9/9 requests                            | PR                  | API           |
| Bruno CLI             | No             | No          | No                       | Hold                                    | Ninguno             | API           |
| Schemathesis          | Sí (`uvx`)     | Sí          | Sí                       | 270/270                                 | Main                | API           |
| Pact                  | No             | No          | No                       | Hold hasta separar releases             | Ninguno             | Architecture  |
| Testcontainers        | Sí             | Sí          | Sí                       | PostgreSQL 1/1 PASS                     | Main                | Backend       |
| MSW                   | Sí             | Sí          | Sí                       | handlers importados/testeados           | PR                  | Frontend      |
| WireMock              | No             | No          | No                       | Hold                                    | Ninguno             | Backend       |
| Toxiproxy             | Sí             | Sí          | Sí                       | 2/2 PASS                                | Main                | Backend       |
| Semgrep CE            | Sí (container) | Sí          | Sí                       | 76 reglas, 0 final                      | PR                  | Security      |
| CodeQL                | GitHub         | Sí          | Pendiente de publicación | Workflow fijado por SHA                 | PR/Main             | Security      |
| Gitleaks              | Sí (container) | Sí          | Sí                       | 0 final; fixture detectada              | PR                  | Security      |
| TruffleHog            | No             | No          | No                       | Hold                                    | Ninguno             | Security      |
| Syft                  | Sí (container) | Sí          | Sí                       | CycloneDX + SPDX                        | PR                  | Security      |
| Grype                 | Sí (container) | Sí          | Sí                       | sin Critical/High tras remediación      | PR                  | Security      |
| Trivy                 | No             | No          | No                       | Hold                                    | Ninguno             | Security      |
| Checkov               | Sí (container) | Sí          | Sí                       | 172 pass, 0 fail                        | Señal               | DevSecOps     |
| OWASP ZAP             | Sí (container) | Sí          | Sí                       | baseline 0 fail, 65 pass                | Main                | Security      |
| Nuclei                | No             | No          | No                       | Hold                                    | Ninguno             | Security      |
| k6                    | Sí (container) | Sí          | Sí                       | thresholds PASS                         | Nightly             | Performance   |
| Artillery             | No             | No          | No                       | Hold                                    | Ninguno             | Performance   |
| sitespeed.io          | Sí (container) | Sí          | Sí                       | 3 runs, HTML/HAR/video                  | Nightly señal       | Performance   |
| Dependency Review     | GitHub         | Sí          | Pendiente de publicación | Bloquea High/Critical nuevos            | PR                  | Security      |
| Dependabot            | GitHub         | Sí          | Pendiente de publicación | pnpm + Actions semanal                  | Automatización      | Platform      |
| actionlint            | Sí (container) | Sí          | Sí                       | workflows PASS                          | PR                  | Platform      |
| OpenSSF Scorecard     | GitHub         | Sí          | Pendiente de publicación | SARIF + Code Scanning                   | Señal               | Security      |
| Harden-Runner         | GitHub         | Sí          | Pendiente de publicación | egress audit                            | Todos los workflows | Platform      |
| Allure                | No             | No          | No                       | Hold                                    | Ninguno             | QA Platform   |
| ReportPortal          | No             | No          | No                       | Reject                                  | Ninguno             | QA Platform   |
| OpenReplay            | No             | No          | No                       | Hold por privacidad/operación           | Ninguno             | Privacy       |
| rrweb                 | Sí             | Sí, opt-in  | Build sí; captura no     | OFF por defecto                         | Ninguno             | Privacy       |
| Playwright Agents     | Sí             | Sí          | Sí                       | planner/generator/healer demostrados    | No gate             | QA + humano   |
| Playwright CLI/Skills | Sí             | Sí          | Sí                       | inicialización/exploración PASS         | No gate             | QA            |
| Playwright MCP        | Sí             | Sí aislado  | No                       | Config experimental                     | No gate             | QA            |
| Chrome DevTools MCP   | Sí             | Sí aislado  | No                       | Config experimental                     | No gate             | Dev           |
| Storybook MCP         | Sí             | Sí aislado  | Build sí; MCP no         | Preview/experimental                    | No gate             | UI            |
| Atlassian Rovo MCP    | No             | No          | No                       | Jira REST suficiente                    | Ninguno             | QA            |
| Stagehand             | No             | No          | No                       | Hold                                    | Ninguno             | QA            |
| Browser Use           | No             | No          | No                       | Hold                                    | Ninguno             | QA            |
| Midscene.js           | No             | No          | No                       | Hold                                    | Ninguno             | QA            |
| TestZeus Hercules     | No             | No          | No                       | Reject                                  | Ninguno             | QA            |

Las imágenes y paquetes instalados tienen versión fija en scripts/manifests. Las herramientas no determinísticas o con acceso MCP nunca deciden un gate ni modifican assertions/baselines sin revisión humana.
