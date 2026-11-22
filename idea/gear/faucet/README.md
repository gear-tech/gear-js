<p align="center">
  <a href="https://gear-tech.io">
    <img src="https://raw.githubusercontent.com/gear-tech/gear/refs/heads/master/.github/images/logo-grey.png" width="400" alt="GEAR">
  </a>
</p>
<h3 align="center">
    Gear Idea Faucet
</h3>
<hr>

# Description

Node.js service providing ERC20 Bridge and WVARA test tokens on Hoodi, plus a separately enabled Vara mainnet faucet.

## Supported modes

- Bridge: `POST /bridge/request` with `address`, `contract` and a captcha `token`. Configure `ETH_PROVIDER`, `ETH_PRIVATE_KEY` and `ETH_ERC20_CONTRACTS` (`address:amount` pairs).
- WVARA: `POST /wvara/request` with `address`. Set `WVARA_ADDRESS` and include that contract in `ETH_ERC20_CONTRACTS`; it uses the same Ethereum processor and signer.
- Vara mainnet: enabled separately with `VARA_MAINNET_FAUCET_ENABLED` and the `VARA_MAINNET_*` settings in `.env.example`. Its API and worker are independent of the retired testnet.

The Vara Substrate testnet faucet and agent token requests have been removed. Their URLs, the obsolete `/balance` alias and `/agent/challenge` follow the service's unknown-route policy (HTTP 404, without a redirect). Bridge requests containing a Substrate `genesis` return HTTP 400 and are not queued. No request is forwarded to mainnet.

## Database compatibility

No database migration is required for this retirement. Keep the existing PostgreSQL enum values: `0` (retired Vara testnet), `1` (Bridge ERC20), `2` (retired Bridge Substrate leg), `3` (WVARA). Keep historical requests and `user_last_seen` rows. The remaining processor consumes types `1` and `3`; startup recovery only changes processing requests of those types. Old pending/processing rows of types `0` and `2` remain historical and are never retried by this service.
