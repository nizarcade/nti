.PHONY: install dev test

install:
	python3 -m venv .venv && . .venv/bin/activate && pip install -U pip && pip install -e .

dev:
	. .venv/bin/activate && uvicorn app.main:app --reload --host 0.0.0.0 --port 8090
