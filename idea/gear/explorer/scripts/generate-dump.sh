#!/usr/bin/env sh
set -e

# Creates a small data-only dump from a real squid-indexed PostgreSQL database.
# Requires: psql, pg_dump, a running Postgres server.
#
# Environment variables (all optional):
#   DB_HOST   – default 127.0.0.1
#   DB_PORT   – default 5432
#   DB_USER   – default $USER or postgres
#   DB_PASS   – default empty
#   DB_NAME   – source database name, default squid
#   DUMP_PATH – output file, default dump.sql in the project root

DB_HOST="${DB_HOST:-127.0.0.1}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USER:-${USER:-postgres}}"
DB_PASS="${DB_PASS:-}"
DB_NAME="${DB_NAME:-squid}"
DUMP_PATH="${DUMP_PATH:-dump.sql}"

TMP_DB="squid_dump_tmp_$$"

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
  _order="${3:-timestamp}"

  printf 'Copying %s rows from "%s"...\n' "$_limit" "$_table"
  psql "$SOURCE_DSN" -c "COPY (SELECT * FROM \"$_table\" ORDER BY $_order LIMIT $_limit) TO STDOUT" | \
    psql "$TMP_DSN" -c "COPY \"$_table\" FROM STDIN"
}

# ── Create temp database ───────────────────────────────────────────────────────

printf 'Creating temporary database "%s"...\n' "$TMP_DB"
if [ "$(db_exists "$TMP_DB")" != "1" ]; then
  psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c "CREATE DATABASE \"$TMP_DB\""
fi

# ── Copy schema ────────────────────────────────────────────────────────────────

printf 'Copying schema from "%s"...\n' "$DB_NAME"
pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
  --schema-only --no-owner --no-privileges --no-comments | \
  psql "$TMP_DSN" > /dev/null

# ── Copy limited rows ────────────────────────────────────────────────────────────

copy_table "code" 3
copy_table "program" 6
copy_table "message_from_program" 10
copy_table "message_to_program" 10
copy_table "event" 5
copy_table "voucher" 5 "issued_at"

# ── Dump data ──────────────────────────────────────────────────────────────────

printf 'Running pg_dump...\n'
pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$TMP_DB" \
  --data-only --no-owner --no-privileges --no-comments > "$DUMP_FILE"

printf 'Dump written to %s\n' "$DUMP_FILE"

# ── Cleanup ────────────────────────────────────────────────────────────────────

printf 'Dropping temporary database "%s"...\n' "$TMP_DB"
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c "DROP DATABASE IF EXISTS \"$TMP_DB\""

printf 'Done.\n'
