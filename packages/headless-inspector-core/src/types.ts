export type ConsoleType = Exclude<keyof Console, 'Console'>;

export type EventValueMap = {
  consoleAPIHasBeenCalled: {
    argumentsList: unknown[];
    type: ConsoleType;
    timestamp: number;
  };
  networkRequestHasBeenMade: {
    type: 'xhr' | 'fetch';
    requestId: string;
    request: NetworkRequest;
    timestamp: number;
  };
  networkRequestHasSucceeded: {
    type: 'xhr' | 'fetch';
    requestId: string;
    response: NetworkResponse;
    timestamp: number;
  };
};

export type NetworkRequest = {
  method: string;
  url: string;
  headers: Record<string, string>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TODO = any;
type NetworkResponse = {
  url: string;
  rawData: TODO;
  text: string;
  status: string;
  statusCode: number;
  headers: Record<string, string>;
};
