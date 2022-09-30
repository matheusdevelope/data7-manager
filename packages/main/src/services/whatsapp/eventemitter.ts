import type { Events } from "../../../../../types/enums/whatsapp";

export const EventEmitter = {
  events: new Map(),
  listen: (topic: Events, cb: (e: unknown) => void) => {
    const oldEvents = EventEmitter.events.get(topic);
    if (EventEmitter.events.has(topic)) {
      return EventEmitter.events.set(topic, [...oldEvents, cb]);
    }
    return EventEmitter.events.set(topic, [cb]);
  },
  emit: (topic: Events, data?: unknown) => {
    const myListeners = EventEmitter.events.get(topic);
    if (Array.isArray(myListeners) && myListeners.length) {
      myListeners.forEach((event: (data: unknown) => void) => event(data));
    }
  },
};
export function on(event: Events, cb: (e: unknown) => void) {
  EventEmitter.listen(event, cb);
}
