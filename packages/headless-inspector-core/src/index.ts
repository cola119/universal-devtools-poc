import { EvEmitter, evemitter } from './evemitter';
import { EventValueMap } from './types';

export * from './evemitter';
export * from './interceptors';
export * from './types';

export type HeadlessInspector = EvEmitter<EventValueMap>;

export const createInspector = (): HeadlessInspector => {
  return evemitter<EventValueMap>();
};
