compose := "docker compose -f backend/db/docker-compose.yml"

alias backend := back
alias frontend := front

[default]
[private]
default:
    @just --list --unsorted

# Install dependencies, back up .env files, and open fresh copies in your editor.
setup:
    #!/usr/bin/env bash
    set -euo pipefail
    read -r -a editor_command <<< "${VISUAL:-${EDITOR:-vi}}"
    command -v "${editor_command[0]}" >/dev/null || { echo "Editor not found: ${editor_command[0]}" >&2; exit 1; }
    command -v npm >/dev/null || { echo "Node.js and npm are required." >&2; exit 1; }
    for project in backend frontend; do
        [[ -f "$project/.env.example" ]] || { echo "Missing $project/.env.example" >&2; exit 1; }
    done
    npm --prefix backend ci
    npm --prefix frontend ci
    for project in backend frontend; do
        if [[ -e "$project/.env" ]]; then
            backup=$(mktemp "$project/.env.backup.$(date +%Y%m%d-%H%M%S).XXXXXXXX")
            cp -p "$project/.env" "$backup"
            echo "Backed up $project/.env to $backup"
        fi
    done
    for project in backend frontend; do
        cp "$project/.env.example" "$project/.env"
        chmod 600 "$project/.env"
    done
    exec "${editor_command[@]}" backend/.env frontend/.env

# Start the frontend development server.
front:
    cd frontend && exec npm run dev

# Start PostgreSQL and the backend; --fresh deletes the existing database.
[arg("fresh", long, value="true")]
back fresh="false":
    #!/usr/bin/env bash
    set -euo pipefail
    command -v docker >/dev/null || { echo "Docker is required." >&2; exit 1; }
    docker compose version >/dev/null || { echo "Docker Compose v2 is required." >&2; exit 1; }
    docker info >/dev/null 2>&1 || { echo "Docker is unavailable. Start your Docker daemon and try again." >&2; exit 1; }
    if [[ "{{ fresh }}" == "true" ]]; then
        echo "Removing the local database and its data volume..."
        {{ compose }} down --volumes
    fi
    {{ compose }} up -d --wait --wait-timeout 60 db
    cd backend
    exec npm run dev

# Remove the database container and network, preserving its data volume.
db-down:
    #!/usr/bin/env bash
    set -euo pipefail
    command -v docker >/dev/null || { echo "Docker is required." >&2; exit 1; }
    docker compose version >/dev/null || { echo "Docker Compose v2 is required." >&2; exit 1; }
    docker info >/dev/null 2>&1 || { echo "Docker is unavailable. Start your Docker daemon and try again." >&2; exit 1; }
    {{ compose }} down
