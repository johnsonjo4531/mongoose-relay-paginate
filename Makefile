test_with_deps:
	$(MAKE) -j 2 parallel_run

parallel_run: run_deps test

run_deps:
	docker compose -p mongoose-relay up --abort-on-container-exit

test:
	yarn run test
