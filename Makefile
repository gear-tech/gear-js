clear_builds:
	find . -name "dist" -type d -prune -exec rm -rf '{}' + | xargs du -chs
	find . -name "build" -type d -prune -exec rm -rf '{}' + | xargs du -chs

clear_node_modules:
	find . -name "node_modules" -type d -prune -exec rm -rf '{}' + | xargs du -chs

clear: clear_builds clear_node_modules

.PHONY: clear clear_builds clear_node_modules