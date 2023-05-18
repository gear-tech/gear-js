FROM postgres:14.2-alpine

# run init.sh
ADD init.sh /docker-entrypoint-initdb.d
