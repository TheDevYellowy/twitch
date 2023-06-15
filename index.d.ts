import { EventEmitter } from "node:events";
import { WebSocket } from "ws";

export type Awaitable<T> = T | PromiseLike<T>;

export type headers = {
  "Authorization": string;
  "Client-Id": string;
};

export class EventSub extends EventEmitter {
  constructor(
    client_id: string,
    client_secret: string,
    client_token: null | string,
    refresh_token: null | string,
  );
  public connection: WebSocket | null;
  public connectedAt: null | number;
  public id: null | string;
  public api: API;

  public connect(url: null | string): void;
  public subscribe(type: string, version: number, condition: object): object;
  public on(event: "debug", listener: (msg: string) => void): this;
  public on(event: string, listener: (...args: any[]) => Awaitable<void>): this;

  private onOpen(): void;
  private onMessage({ data }): void;
  private onPacket(packet: object): void;
  private debug(msg: string): void;
}

export class API extends EventEmitter {
  constructor(
    id: string,
    secret: string,
    token: string | null,
    refreshToken: string | null,
  );
  public client_id: string;
  public client_secret: string;
  public refresh_token: string;
  public token: string;
  public headers: headers;
  public valid: boolean;

  public post(url: string, headers: object, data: object): string | object;
  public patch(url: string, headers: object, data: object): string | object;
  public get(url: string): string | object;
  public delete(url: string): string | object;

  public on(
    event: "result",
    listener: (
      type: "post" | "patch" | "get" | "delete",
      url: string,
      json: object,
    ) => void,
  ): this;
}
