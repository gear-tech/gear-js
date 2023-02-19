TEST_PROGRAM_PATH := ../../api
MOVE_PROGRAM_PATH := ../../../../../../idea/tests/wasm-test
MOVE_PROGRAM_META_TXT_PATH := ../../../../idea/tests/wasm-test

test:
	cd $(TEST_PROGRAM_PATH)/test/programs && rm -rf target
	cd $(TEST_PROGRAM_PATH) && make build
	cd $(TEST_PROGRAM_PATH)/test/programs/target/wasm32-unknown-unknown/release && cp test_meta.opt.wasm $(MOVE_PROGRAM_PATH)
	cd $(TEST_PROGRAM_PATH)/test/programs/target/wasm32-unknown-unknown/release && cp test_meta_state_v1.meta.wasm $(MOVE_PROGRAM_PATH)
	cd $(TEST_PROGRAM_PATH)/test/programs/target/wasm32-unknown-unknown/release && cp test_meta_state_v2.meta.wasm $(MOVE_PROGRAM_PATH)
	cd $(TEST_PROGRAM_PATH)/test/programs/test-meta && cp meta.txt $(MOVE_PROGRAM_META_TXT_PATH)
	rm -rf build && yarn build && yarn test
	cd wasm-test && rm -rf meta.txt test_meta.opt.wasm test_meta_state_v1.meta.wasm test_meta_state_v2.meta.wasm



