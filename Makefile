test_with_deps:
	$(MAKE) -j 2 run_deps test docker_stop

run_deps:
	docker compose -p mongoose-relay up --abort-on-container-exit

test:
	yarn run test

docker_stop:
	docker compose -p mongoose-relay stop
