# Menu Administration

Requires Node.js/npm, [Just](https://just.systems/) ≥1.46, Bash, and Docker with Compose v2.

## Installation and Setup

```sh
just setup
```

This installs dependencies and opens fresh `.env` files in your default editor.
Review the values and set the backend's `JWT_SECRET`. Existing `.env` files are backed up before replacement.

Start Docker, then run in separate terminals:

```sh
just back   # Starts PostgreSQL, waits for readiness, then starts the backend
just front  # Frontend: http://localhost:5173
```

Ctrl+C stops each server. The database stays running.

```sh
just db-down       # Stop the database; keep its data
just back --fresh  # Delete database data and restart; stop the backend first
```
