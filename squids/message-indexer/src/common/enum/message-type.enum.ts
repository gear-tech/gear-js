export enum MessageType {
    USER_MSG_SENT = 'UserMessageSent',
    USER_MSG_READ = 'UserMessageRead',
    QUEUED = 'MessageQueued',
    WOKEN = 'MessageWoken',
    WAITED = 'MessageWaited',
    DISPATCHED = 'MessagesDispatched',
}

export enum EventType {
    GEAR_MSG_WOKEN = 'Gear.MessageWoken',
    GEAR_MSG_WAITED = 'Gear.MessageWaited',
    GEAR_MSG_DISPATCHED = 'Gear.MessagesDispatched',
    GEAR_USER_MSG_READ = 'Gear.UserMessageRead',
    GEAR_USER_MSG_SENT = 'Gear.UserMessageSent',
    GEAR_MSG_QUEUED = 'Gear.MessageQueued',
}
