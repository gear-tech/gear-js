export enum MessageType {
    USER_MESS_SENT = 'UserMessageSent',
    USER_MESS_READ = 'UserMessageRead',
    ENQUEUED = 'MessageQueued',
    WOKEN = 'MessageWoken',
    WAITED = 'MessageWaited',
    DISPATCHED = 'MessagesDispatched',
}

export enum SubSquidMessageEventType {
    GEAR_MESS_WOKEN = 'Gear.MessageWoken',
    GEAR_MESS_WAITED = 'Gear.MessageWaited',
    GEAR_MESS_DISPATCHED = 'Gear.MessagesDispatched',
    GEAR_USER_MESS_READ = 'Gear.UserMessageRead',
    GEAR_USER_MESS_SENT = 'Gear.UserMessageSent',
    GEAR_MESS_ENQUEUED = 'Gear.MessageQueued',
}
