# Generated QA reports

Run `pnpm qa:report` after any suite. It creates `reports/index.html` linking the artifacts currently present under the ignored `reports/generated/` directory. CI uploads those generated artifacts; they are not committed because they contain run-specific paths and metadata.
