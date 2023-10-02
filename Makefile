test_with_deps:
	$(MAKE) -j 2 run_deps test exit

run_deps:
	docker compose -p mongoose-relay up --abort-on-container-exit

test:
	yarn run test

exit:
	exit 1
