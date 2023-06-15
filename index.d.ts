import { EventEmitter } from "node:events";
import { WebSocket } from "ws";

export type Awaitable<T> = T | PromiseLike<T>;

export type headers = {
  "Authorization": string;
  "Client-Id": string;
};

export type eventType =
  | "channel.update"
  | "channel.follow"
  | "channel.subscribe"
  | "channel.subscription.end"
  | "channel.subscription.gift"
  | "channel.subscription.message"
  | "channel.cheer"
  | "channel.raid"
  | "channel.ban"
  | "channel.unban"
  | "channel.moderator.add"
  | "channel.moderator.remove"
  | "channel.guest_star_session.begin"
  | "channel.guest_star_session.end"
  | "channel.guest_star_guest.update"
  | "channel.guest_star_slot.update"
  | "channel.guest_star_settings.update"
  | "channel.channel_points_custom_reward.add"
  | "channel.channel_points_custom_reward.update"
  | "channel.channel_points_custom_reward.remove"
  | "channel.channel_points_custom_reward_redemption.add"
  | "channel.channel_points_custom_reward_redemption.update"
  | "channel.poll.begin"
  | "channel.poll.progress"
  | "channel.poll.end"
  | "channel.prediction.begin"
  | "channel.prediction.progress"
  | "channel.prediction.lock"
  | "channel.prediction.end"
  | "channel.charity_campaign.donate"
  | "channel.charity_campaign.start"
  | "channel.charity_campaign.progress"
  | "channel.charity_campaign.stop"
  | "drop.entitlement.grant"
  | "extension.bits_transaction.create"
  | "channel.goal.begin"
  | "channel.goal.progress"
  | "channel.goal.end"
  | "channel.hype_train.begin"
  | "channel.hype_train.progress"
  | "channel.hype_train.end"
  | "channel.shield_mode.begin"
  | "channel.shield_mode.end"
  | "channel.shoutout.create"
  | "channel.shoutout.receive"
  | "channel.online"
  | "channel.offline"
  | "user.authorization.grant"
  | "user.authorization.revoke"
  | "user.update";

export type subVersion = 1 | 2 | "beta";

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
  public subscribe(
    type: eventType,
    version: subVersion,
    condition: object,
  ): object;
  public on(event: "debug", listener: (msg: string) => void): this;
  public on(event: "raw", listener: (packet: object) => void): this;
  public on(event: "online", listener: () => void): this;
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
