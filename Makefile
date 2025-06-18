.PHONY: up down build shell frontend

build:
	docker compose build
up:
	docker compose up -d
down:
	docker compose down
shell:
	docker compose exec php bash
frontend:
	docker compose exec node bash
