## Example of an NFT marketplace indexer built using [subsquid processor](https://github.com/subsquid/squid)

### Run

1. Create a postgres database and specify its parameters in environment variables (take a look at the .env.example file)

2. Install dependencies and run build process
```bash
make install
make build
```

4. Apply the migrations
```bash
make migrations-apply
```

5. Specify the necessary environment variables (as in the .env.example file)
```bash
make run
```

6. Run the app
```bash
make run
```