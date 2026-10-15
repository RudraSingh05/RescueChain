
#!/bin/sh
set -eu

node workers/deliveryWorker.js &
WORKER_PID=$!

node server.js &
SERVER_PID=$!

shutdown() {
  kill "$WORKER_PID" "$SERVER_PID" 2>/dev/null || true
}

trap shutdown TERM INT

wait "$SERVER_PID"
SERVER_EXIT=$?

shutdown
wait "$WORKER_PID" 2>/dev/null || true

exit "$SERVER_EXIT"
