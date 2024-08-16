import { EventType } from '../api';

const getEventMethod = ({ service, name }: EventType) => (service && name ? `${service}.${name}` : service || name);

export { getEventMethod };
