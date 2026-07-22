const DEFAULT_ADMIN_URL = 'http://127.0.0.1:3010/api/v1/mainnet';

interface ParsedArgs {
  command?: string;
  claimId?: string;
  flags: Record<string, string | true>;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const baseUrl = trimTrailingSlash(process.env.VARA_MAINNET_ADMIN_URL || DEFAULT_ADMIN_URL);
  const adminKey = process.env.VARA_MAINNET_ADMIN_API_KEY;

  if (!adminKey) usage('VARA_MAINNET_ADMIN_API_KEY is required');

  if (args.command === 'list-reconciliation') {
    await requestJson(`${baseUrl}/admin/reconciliation`, { method: 'GET', adminKey, actor: stringFlag(args, 'actor') });
    return;
  }

  if (!args.command || !args.claimId) usage('Command and claimId are required');

  if (args.command === 'mark-finalized') {
    await requestJson(`${baseUrl}/admin/reconciliation/${args.claimId}`, {
      method: 'POST',
      adminKey,
      actor: stringFlag(args, 'actor'),
      body: {
        action: 'mark_finalized',
        transactionHash: requiredFlag(args, 'tx'),
        blockHash: requiredFlag(args, 'block'),
        note: stringFlag(args, 'note'),
      },
    });
    return;
  }

  if (args.command === 'mark-failed-terminal') {
    await requestJson(`${baseUrl}/admin/reconciliation/${args.claimId}`, {
      method: 'POST',
      adminKey,
      actor: stringFlag(args, 'actor'),
      body: {
        action: 'mark_failed_terminal',
        reasonCode: requiredFlag(args, 'reason'),
        note: stringFlag(args, 'note'),
      },
    });
    return;
  }

  if (args.command === 'requeue') {
    await requestJson(`${baseUrl}/admin/reconciliation/${args.claimId}`, {
      method: 'POST',
      adminKey,
      actor: stringFlag(args, 'actor'),
      body: {
        action: 'requeue',
        note: stringFlag(args, 'note'),
      },
    });
    return;
  }

  usage(`Unknown command: ${args.command}`);
}

function parseArgs(argv: string[]): ParsedArgs {
  const [command, maybeClaimId, ...rest] = argv;
  const flags: Record<string, string | true> = {};

  for (let index = 0; index < rest.length; index++) {
    const token = rest[index];
    if (!token.startsWith('--')) usage(`Unexpected argument: ${token}`);
    const key = token.slice(2);
    const next = rest[index + 1];
    if (!next || next.startsWith('--')) {
      flags[key] = true;
    } else {
      flags[key] = next;
      index++;
    }
  }

  return { command, claimId: maybeClaimId, flags };
}

async function requestJson(url: string, options: { method: 'GET' | 'POST'; adminKey: string; actor?: string; body?: Record<string, unknown> }) {
  const response = await fetch(url, {
    method: options.method,
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Key': options.adminKey,
      ...(options.actor ? { 'X-Admin-Actor': options.actor } : {}),
    },
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  });
  const text = await response.text();
  const body = text ? JSON.parse(text) : {};

  console.log(JSON.stringify(body, null, 2));
  if (!response.ok) process.exitCode = 1;
}

function requiredFlag(args: ParsedArgs, name: string) {
  const value = stringFlag(args, name);
  if (!value) usage(`--${name} is required`);
  return value;
}

function stringFlag(args: ParsedArgs, name: string) {
  const value = args.flags[name];
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, '');
}

function usage(error?: string): never {
  if (error) console.error(error);
  console.error(`
Usage:
  yarn workspace gear-idea-faucet mainnet:admin list-reconciliation [--actor <name>]
  yarn workspace gear-idea-faucet mainnet:admin mark-finalized <claimId> --tx <hash> --block <hash> [--actor <name>] [--note <text>]
  yarn workspace gear-idea-faucet mainnet:admin mark-failed-terminal <claimId> --reason <code> [--actor <name>] [--note <text>]
  yarn workspace gear-idea-faucet mainnet:admin requeue <claimId> [--actor <name>] [--note <text>]

Env:
  VARA_MAINNET_ADMIN_API_KEY  required
  VARA_MAINNET_ADMIN_URL      defaults to ${DEFAULT_ADMIN_URL}
`);
  process.exit(1);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
