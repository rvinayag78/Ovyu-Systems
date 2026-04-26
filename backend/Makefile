.PHONY: dev migrate upgrade downgrade logs errors tail query

dev:
	uvicorn app.main:app --reload --port 8000

migrate:
	alembic revision --autogenerate -m "$(msg)"

upgrade:
	alembic upgrade head

downgrade:
	alembic downgrade -1

logs:
	@bash scripts/logs.sh recent

errors:
	@bash scripts/logs.sh errors

tail:
	@bash scripts/logs.sh tail

query:
	@bash scripts/logs.sh query
