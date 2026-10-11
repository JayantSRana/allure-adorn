import { EventEmitter } from 'events';

export type RealtimeEvent =
  | 'ORDER_CREATED'
  | 'ORDER_PAID'
  | 'ORDER_UPDATED'
  | 'ORDER_SHIPPED'
  | 'INVENTORY_UPDATED'
  | 'SETTINGS_UPDATED'
  | 'REVIEW_ADDED';

interface Envelope {
  event: RealtimeEvent;
  data: unknown;
  at: string;
}

// A process-wide bus. Sufficient for a single Node server / dev demo.
// In multi-instance production, back this with Redis pub/sub.
const globalForBus = globalThis as unknown as { __allureBus?: EventEmitter };
export const bus: EventEmitter =
  globalForBus.__allureBus ?? (globalForBus.__allureBus = new EventEmitter());
bus.setMaxListeners(0);

export function broadcast(event: RealtimeEvent, data: unknown): void {
  const envelope: Envelope = { event, data, at: new Date().toISOString() };
  bus.emit('event', envelope);
}
