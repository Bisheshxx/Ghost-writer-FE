#!/bin/bash
set -e

echo "Syncing backend API (Swagger)..."

pnpm run sync:api

cat <<EOF

API context updated.

Rules for Codex:
- Use openapi/swagger.json as source of truth
- Do NOT invent endpoints
- Update existing frontend services instead of generating new API layer
- Prefer modifying src/services/* when backend changes

EOF
