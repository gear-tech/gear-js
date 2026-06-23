#!/usr/bin/env sh
set -e

# Creates a small data-only dump from a real Vara.Eth indexer PostgreSQL database.
# Requires: psql, pg_dump, a running Postgres server.
#
# Environment variables (all optional):
#   DB_HOST   – default 127.0.0.1
#   DB_PORT   – default 5432
#   DB_USER   – default $USER or postgres
#   DB_PASS   – default empty
#   DB_NAME   – source database name, default vara_eth
#   DUMP_PATH – output file, default dump.sql in the project root

DB_HOST="${DB_HOST:-127.0.0.1}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USER:-${USER:-postgres}}"
DB_PASS="${DB_PASS:-}"
DB_NAME="${DB_NAME:-vara_eth}"
DUMP_PATH="${DUMP_PATH:-dump.sql}"

TMP_DB="vara_eth_dump_tmp_$$"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
DUMP_FILE="${PROJECT_ROOT}/${DUMP_PATH}"

export PGPASSWORD="${DB_PASS}"

SOURCE_DSN="postgresql://${DB_USER}@${DB_HOST}:${DB_PORT}/${DB_NAME}"
TMP_DSN="postgresql://${DB_USER}@${DB_HOST}:${DB_PORT}/${TMP_DB}"

# ── Helpers ────────────────────────────────────────────────────────────────────

db_exists() {
  psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -Atc \
    "SELECT 1 FROM pg_database WHERE datname = '$1'"
}

copy_table() {
  _table="$1"
  _limit="$2"
  _order="${3:-created_at}"

  printf 'Copying %s rows from "%s"...\n' "$_limit" "$_table"
  psql "$SOURCE_DSN" -c "COPY (SELECT * FROM \"$_table\" ORDER BY $_order LIMIT $_limit) TO STDOUT" | \
    psql "$TMP_DSN" -c "COPY \"$_table\" FROM STDIN"
}

# PostgreSQL 15 doesn't recognise transaction_timeout (introduced in 17).
# Strip it from the schema-only dump so pg_restore doesn't choke.
strip_transaction_timeout() {
  sed '/^SET transaction_timeout = 0;$/d'
}

# ── Create temp database ───────────────────────────────────────────────────────

printf 'Creating temporary database "%s"...\n' "$TMP_DB"
if [ "$(db_exists "$TMP_DB")" != "1" ]; then
  psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c "CREATE DATABASE \"$TMP_DB\""
fi

cleanup() {
  printf 'Dropping temporary database "%s"...\n' "$TMP_DB"
  psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c "DROP DATABASE IF EXISTS \"$TMP_DB\"" >/dev/null 2>&1 || true
}
trap cleanup EXIT INT TERM

# ── Copy schema ────────────────────────────────────────────────────────────────

printf 'Copying schema from "%s"...\n' "$DB_NAME"
pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
  --schema-only --no-owner --no-privileges --no-comments | \
  strip_transaction_timeout | \
  psql "$TMP_DSN" > /dev/null

# Disable FK checks in the temp DB so we can load tables in any order
# and still respect the row limits per table.
psql "$TMP_DSN" -c 'ALTER TABLE program DROP CONSTRAINT IF EXISTS "FK_0a5783ec166b1a3d42ba1143f99" CASCADE'
psql "$TMP_DSN" -c 'ALTER TABLE message_request DROP CONSTRAINT IF EXISTS "FK_b4ce125d991a44ec786b4f78fa4" CASCADE'
psql "$TMP_DSN" -c 'ALTER TABLE state_transition DROP CONSTRAINT IF EXISTS "FK_6b8bac83639f4ae90640560eab4" CASCADE'
psql "$TMP_DSN" -c 'ALTER TABLE state_transition DROP CONSTRAINT IF EXISTS "FK_a019efeec33436daabca0cb7c48" CASCADE'
psql "$TMP_DSN" -c 'ALTER TABLE message_sent DROP CONSTRAINT IF EXISTS "FK_c652bb7a4a69dda2774f455b59c" CASCADE'
psql "$TMP_DSN" -c 'ALTER TABLE message_sent DROP CONSTRAINT IF EXISTS "FK_f24706a5e9ce0becab2cde1b7c6" CASCADE'
psql "$TMP_DSN" -c 'ALTER TABLE reply_request DROP CONSTRAINT IF EXISTS "FK_1788c79b3ad37b7f0bc6a4e9674" CASCADE'
psql "$TMP_DSN" -c 'ALTER TABLE reply_sent DROP CONSTRAINT IF EXISTS "FK_adaa1a3abbb9bf57453dd7fe35b" CASCADE'
psql "$TMP_DSN" -c 'ALTER TABLE reply_sent DROP CONSTRAINT IF EXISTS "FK_529caaa898b37a0baa91fd8c85f" CASCADE'

# ── Copy limited rows ────────────────────────────────────────────────────────────

copy_table "code" 3
copy_table "program" 3
copy_table "batch" 2 "committed_at"
copy_table "state_transition" 4
copy_table "ethereum_tx" 3
copy_table "message_request" 5
copy_table "message_sent" 5
copy_table "reply_request" 4
copy_table "reply_sent" 4
copy_table "injected_transaction" 3
copy_table "hash_registry" 20

# ── Dump data ──────────────────────────────────────────────────────────────────

printf 'Running pg_dump...\n'
pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$TMP_DB" \
  --data-only --no-owner --no-privileges --no-comments | \
  strip_transaction_timeout | \
  grep -v '^\\\(restrict\|unrestrict\) ' > "$DUMP_FILE"

printf 'Dump written to %s\n' "$DUMP_FILE"

printf 'Done.\n'
