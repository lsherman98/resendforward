pb:
	cd pocketbase && go run . serve

build:
	pnpm build
	cd pocketbase && go build -o server .

dev: 
	pnpm dev

migrate: 
	cd pocketbase && go run . migrate collections

sync: 
	cd pocketbase && go run . migrate history-sync

types: 
	pnpm pb:typegen