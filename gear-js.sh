#!/bin/sh

command="$1"
pkg="$2"

SQUID_TYPEORM_MIGRATION_BIN="node_modules/.bin/squid-typeorm-migration"


if [ "$command" == "install" ]; then
    echo "Installing dependencies"
    yarn install
elif [ "$command" == "build" ]; then
    echo "Building $pkg"
    yarn build:$pkg
elif [ "$command" = "run" ]; then
    echo "Running squid"
    case $pkg in
        "squid")
            if [ -f "$SQUID_TYPEORM_MIGRATION_BIN" ]; then
                node $SQUID_TYPEORM_MIGRATION_BIN apply
            else
                cd idea/squid
                node $SQUID_TYPEORM_MIGRATION_BIN apply
                cd ../../
            fi
            node idea/squid/lib/main.js
            ;;
        *)
            echo "Invalid package"
            ;;
    esac
else
    echo "Invalid command"
fi
