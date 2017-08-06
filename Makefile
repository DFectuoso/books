include ./.env.default

BIN_DIR ?= ./node_modules/.bin

help:
	@echo
	@echo "  \033[34mapi-server\033[0m  start dev server"

api-server:
	@$(BIN_DIR)/nodemon api/runner.js

run-test:
	@$(BIN_DIR)/mocha