clear:
	find . -name "node_modules" -type d -prune -exec rm -rf '{}' + | xargs du -chs