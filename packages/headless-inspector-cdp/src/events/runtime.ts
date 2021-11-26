import { ConsoleType, HeadlessInspector } from 'headless-inspector-core';
import { CDPClient } from '../client';
import {
  CDPConsoleType,
  ConsoleAPICalledEvent,
} from '../objects/runtime/ConsoleAPICalledEvent';
import { GetPropertiesResponse } from '../objects/runtime/GetPropertiesResponse';
import { ObjectLike, objectStore } from '../store/ObjectStore';
import { isObject, randomNumId } from '../utils';

const toCDPConsoleType = (type: ConsoleType): CDPConsoleType => {
  if (type === 'warn') return 'warning';
  if (
    type === 'countReset' ||
    type === 'time' ||
    type === 'timeLog' ||
    type === 'timeStamp' ||
    type === 'group' ||
    type === 'groupCollapsed' ||
    type === 'groupEnd'
  ) {
    throw new Error(`console.${type} is not supported yet`);
  }
  return type;
};

const getObjectId = (v: ObjectLike) => objectStore.getObjectIdOf(v);
const getObject = (id: string) => objectStore.getObjectOf(id);

export const attachRuntimeEvents = (
  client: CDPClient,
  interceptor: HeadlessInspector
) => {
  interceptor.on(
    'consoleAPIHasBeenCalled',
    ({ argumentsList, type, timestamp }) => {
      argumentsList.forEach((v) => objectStore.storeObject(v));
      const params = new ConsoleAPICalledEvent(
        {
          argumentsList,
          type: toCDPConsoleType(type),
          timestamp,
        },
        randomNumId(),
        getObjectId
      );
      client.emit('Runtime.consoleAPICalled', params);
    }
  );

  client.on('Runtime.getProperties', (params) => {
    const object = getObject(params.objectId);
    if (!isObject(object)) return undefined;
    const response = new GetPropertiesResponse(object, getObjectId);
    return response;
  });
};
