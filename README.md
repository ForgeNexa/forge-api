# Forge API (`forge-api`)

[![CI](https://github.com/ForgeNexa/forge-api/actions/workflows/ci.yml/badge.svg)](https://github.com/ForgeNexa/forge-api/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**Forge API** is a high-performance, local-first API workbench and testing client designed as an independent alternative to Postman, developed under the **ForgeNexa** ecosystem.

---

## Key Capabilities

- **Go API Engine (`engine/`)**: Concurrent HTTP/REST/GraphQL executor with connection pooling, sub-millisecond telemetry, and cancellation support.
- **Modern Interactive Workbench (`web/`)**: React 19 + TypeScript + Tailwind CSS client with request history, header management, and live JSON response inspection.
- **Local-First Privacy**: Sensitive auth tokens and environment secrets are kept encrypted and never synced to external cloud accounts.

---

## Development

```bash
# Test the Go execution engine
cd engine && go test -v -race ./...

# Build the web workbench
cd web && bun install && bun run build
```
