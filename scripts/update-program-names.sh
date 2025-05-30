#!/bin/bash
# This script updates program names in PostgreSQL database
# Usage: ./update-program-names.sh <host> <username> <source_database> <target_database>

host=$1
username=$2
source_db=$3
target_db=$4

# Validate input parameters
if [ -z "$host" ] || [ -z "$username" ] || [ -z "$source_db" ] || [ -z "$target_db" ]; then
    echo "Error: Missing required parameters"
    echo "Usage: $0 <host> <username> <source_database> <target_database>"
    exit 1
fi

echo "Starting program name update process..."
echo "Source DB: $source_db, Target DB: $target_db"

# Get count of programs that need updating
echo "Checking for programs to update..."
update_count=$(psql -h "$host" -U "$username" -d "$source_db" -t -A -c "SELECT count(*) FROM program WHERE id != name;")
echo "Found $update_count programs to update"

if [ "$update_count" -eq 0 ]; then
    echo "No programs need updating"
    exit 0
fi

# Create a temporary file for the data transfer
temp_file=$(mktemp)
echo "Using temporary file: $temp_file"

# Export data from source database as CSV with proper escaping
echo "Exporting data from source database..."
psql -h "$host" -U "$username" -d "$source_db" <<EOF
\copy (SELECT name, id FROM program WHERE id != name) TO '$temp_file' WITH CSV
EOF

# Import to target database and update in a single transaction
echo "Updating target database..."
psql -h "$host" -U "$username" -d "$target_db" <<EOF
-- Create a temporary table for the update data
CREATE TEMP TABLE program_updates (name TEXT, id TEXT);

-- Import the CSV data with standard PostgreSQL CSV handling
\copy program_updates FROM '$temp_file' WITH CSV;

-- Perform batch update in a single transaction
BEGIN;
UPDATE program
SET name = program_updates.name
FROM program_updates
WHERE program.id = program_updates.id;
COMMIT;

-- Report how many rows were updated
SELECT count(*) AS "Rows Updated" FROM program_updates;

-- Clean up temporary table
DROP TABLE program_updates;
EOF

# Clean up temporary file
rm -f "$temp_file"

echo "Verification:"
echo "Source database ($source_db) programs with id != name:"
psql -h "$host" -U "$username" -d "$source_db" -c "SELECT count(id) FROM program WHERE id != name"

echo "Target database ($target_db) remaining programs with id != name:"
psql -h "$host" -U "$username" -d "$target_db" -c "SELECT count(id) FROM program WHERE id != name"

echo "Program name update process completed successfully!"
