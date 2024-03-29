.PHONY: help

.DEFAULT_GOAL := help

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

build: ## build the docker image locally
	@docker-compose -f ./docker-compose.yml build
publish: build  ## publish version to docker hub
	docker push istex/istex-lodex-data:${npm_package_version}
run: ## to run locally
	@docker-compose -f ./docker-compose.yml up

