.PHONY: dev migrate upgrade downgrade shell

dev:
	uvicorn app.main:app --reload --port 8000

migrate:
	alembic revision --autogenerate -m "$(msg)"

upgrade:
	alembic upgrade head

downgrade:
	alembic downgrade -1

shell:
	python -c "import asyncio; from app.core.database import AsyncSessionLocal; print('db ready')"
