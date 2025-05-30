# Events

## Event Handling

### Subscribe to All Events

Monitor all system events:

```typescript
import { GearApi } from '@gear-js/api';

const api = await GearApi.create();

// Subscribe to all events
const unsubscribe = await api.query.system.events((events) => {
  console.log('New events:', events.toHuman());
});

// Later: unsubscribe to stop receiving events
unsubscribe();
```

### Filter Specific Events

Filter and handle specific event types:

```typescript
import { GearApi } from '@gear-js/api';

const api = await GearApi.create();

api.query.system.events((events) => {
  // Handle Gear message events
  events
    .filter(({ event }) => api.events.gear.MessageQueued.is(event))
    .forEach(({ event: { data } }) => {
      console.log('MessageQueued:', data.toHuman());
    });

  // Handle balance transfer events
  events
    .filter(({ event }) => api.events.balances.Transfer.is(event))
    .forEach(({ event: { data } }) => {
      console.log('Balance transfer:', data.toHuman());
    });
});
```

### Subscribe to Gear Events

Subscribe to specific Gear pallet events using the dedicated API:

```typescript
import { GearApi } from '@gear-js/api';

const api = await GearApi.create();

// Subscribe to UserMessageSent events
const unsubscribe = api.gearEvents.subscribeToGearEvent(
  'UserMessageSent',
  ({ data: { message } }) => {
    console.log(`
Message Details:
---------------
ID:          ${message.id}
Source:      ${message.source}
Destination: ${message.destination}
Payload:     ${JSON.stringify(message.payload, null, 2)}
Value:       ${message.value}
${message.reply ? `Reply To:    ${message.reply.replyTo}
Exit Code:   ${message.reply.exitCode}` : ''}
    `);
  }
);

// Later: unsubscribe to stop receiving events
unsubscribe();
```

Available Gear Events:
- `UserMessageSent`: Triggered when a program sends message to a user
- `MessageQueued`: Triggered when a message is added to the queue
- `ProgramChanged`: Triggered when a program state is modified
- `CodeChanged`: Triggered when program code state is modified
- `UserMessageRead`: Triggered when a user sends reply or claims value sent from a program

---