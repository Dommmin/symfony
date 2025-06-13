#!/bin/bash
set -eo pipefail

if [ ! -d "node_modules" ] && [ -f "package.json" ]; then
    echo "Installing Node dependencies..."
    npm install
fi

echo "Starting Supervisor..."
exec /usr/bin/supervisord -n -c /etc/supervisor/supervisord.conf
