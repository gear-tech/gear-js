API_PATH := ../../api
TEST_PROGRAM_TARGET_PATH := ../../api/programs/target/wasm32-unknown-unknown/release
TEST_META_TXT_PATH := ../../api/programs/test-meta/test_meta.meta.txt
MOVE_PROGRAM_PATH := ./wasm-test

build_programs:
	@echo "Build programs"
	@cd $(API_PATH) && make all

cp_build:
	@echo "Copy built files"
	@cp $(TEST_PROGRAM_TARGET_PATH)/test_meta.opt.wasm $(MOVE_PROGRAM_PATH)
	@cp $(TEST_PROGRAM_TARGET_PATH)/test_meta_state_v1.meta.wasm $(MOVE_PROGRAM_PATH)
	@cp $(TEST_PROGRAM_TARGET_PATH)/test_meta_state_v2.meta.wasm $(MOVE_PROGRAM_PATH)
	@cp $(TEST_META_TXT_PATH) $(MOVE_PROGRAM_PATH)

run_test:
	@echo "Run test"
	@yarn build && yarn test
	@cd wasm-test && rm -rf meta.txt test_meta.opt.wasm test_meta_state_v1.meta.wasm test_meta_state_v2.meta.wasm


test: build_programs cp_build run_test
