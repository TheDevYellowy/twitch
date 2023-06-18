import { EventEmitter } from "node:events";
import { WebSocket } from "ws";

export type Awaitable<T> = T | PromiseLike<T>;

export type headers = {
  "Authorization": string;
  "Client-Id": string;
};

export interface Events {
  "channel.update": [event: updateEvent];
  "channel.follow": [event: followEvent];
  "channel.subscribe": [event: subscribeEvent];
  "channel.subscription.end": [event: subscriptionEndEvent];
  "channel.subscription.gift": [event: subscriptionGiftEvent];
  "channel.subscription.message": [event: subscriptionMessageEvent];
  "channel.cheer": [event: cheerEvent];
  "channel.raid": [event: raidEvent];
  "channel.ban": [event: banEvent];
  "channel.unban": [event: unbanEvent];
  "channel.moderator.add": [event: moderatorAddEvent];
  "channel.moderator.remove": [event: moderatorRemoveEvent];
  "channel.guest_star_session.begin": [event: guestStarSessionBeginEvent];
  "channel.guest_star_session.end": [event: guestStarSessionEndEvent];
  "channel.guest_star_guest.update": [event: guestStarGuestUpdateEvent];
  "channel.guest_star_slot.update": [event: guestStarSlotUpdateEvent];
  "channel.guest_star_settings.update": [event: guestStarSettingsUpdateEvent];
  "channel.channel_points_custom_reward.add": [
    event: channelPointsCustomRewardAddEvent,
  ];
  "channel.channel_points_custom_reward.update": [
    event: channelPointsCustomRewardUpdateEvent,
  ];
  "channel.channel_points_custom_reward.remove": [
    event: channelPointsCustomRewardRemoveEvent,
  ];
  "channel.channel_points_custom_reward_redemption.add": [
    event: channelPointsCustomRewardRedemptionAddEvent,
  ];
  "channel.channel_points_custom_reward_redemption.update": [
    event: channelPointsCustomRewardRedemptionUpdateEvent,
  ];
  "channel.poll.begin": [event: pollBeginEvent];
  "channel.poll.progress": [event: pollProgressEvent];
  "channel.poll.end": [event: pollEndEvent];
  "channel.prediction.begin": [event: predictionBeginEvent];
  "channel.prediction.progress": [event: predictionProgressEvent];
  "channel.prediction.lock": [event: predictionLockEvent];
  "channel.prediciton.end": [event: predictionEndEvent];
  "channel.charity_campaign.donate": [event: charityDonationEvent];
  "channel.charity_campaign.start": [event: charityCampaignStartEvent];
  "channel.charity_campaign.progress": [event: charityCampaignProgressEvent];
  "channel.charity_campaign.stop": [event: charityCampaignStopEvent];
  "drop.entitlement.grant": [events: dropEntitlementGrantEvent];
  "extension.bits_transaction.create": [
    event: extensionBitsTransactionCreateEvent,
  ];
  "channel.goal.begin": [event: goalsEvent];
  "channel.goal.progress": [event: goalsEvent];
  "channel.goal.end": [event: goalsEvent];
  "channel.hype_train.begin": [event: hypeTrainBeginEvent];
  "channel.hype_train.progress": [event: hypeTrainProgressEvent];
  "channel.hype_train.end": [event: hypeTrainEndEvent];
  "channel.shield_mode.begin": [event: shieldModeBeginEvent];
  "channel.shield_mode.end": [event: shieldModeEndEvent];
  "channel.shoutout.create": [event: shoutoutCreateEvent];
  "channel.shoutout.receive": [event: shoutoutReceiveEvent];
  "stream.online": [event: streamOnline];
  "stream.offline": [event: streamOffline];
  "user.authorization.grant": [event: userAuthorizationGrantEvent];
  "user.authorization.revoke": [event: userAuthorizationRevokeEvent];
  "user.update": [event: userUpdateEvent];
}

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

export type conditions = {
  "broadcaster_user_id"?: string;
  "to_broadcaster_user_id"?: string;
  "moderator_user_id"?: string;
  "reward_id"?: string;
  "organization_id"?: string;
  "category_id"?: string;
  "campaign_id"?: string;
  "extension_client_id"?: string;
  "client_id"?: string;
  "user_id"?: string;
};

export type updateEvent = {
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  title: string;
  language: string;
  category_id: string;
  category_name: string;
  is_mature: boolean;
};

export type followEvent = {
  user_id: string;
  user_login: string;
  user_name: string;
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  followed_at: string;
};

export type subscribeEvent = {
  user_id: string;
  user_login: string;
  user_name: string;
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  tier: "1000" | "2000" | "3000" | "Prime";
  is_gift: boolean;
};

export type subscriptionEndEvent = {
  user_id: string;
  user_login: string;
  user_name: string;
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  tier: "1000" | "2000" | "3000" | "Prime";
  is_gift: boolean;
};

export type subscriptionGiftEvent = {
  user_id: string;
  user_login: string;
  user_name: string;
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  total: number;
  tier: "1000" | "2000" | "3000";
  cumulative_total: number | null;
  is_anonymous: boolean;
};

export type subscriptionMessageEvent = {
  user_id: string;
  user_login: string;
  user_name: string;
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  tier: "1000" | "2000" | "3000" | "Prime";
  message: {
    text: string;
    emotes: {
      begin: number;
      end: number;
      id: string;
    }[];
  };
  cumlative_months: number;
  streak_months: number | null;
  duration_months: number;
};

export type cheerEvent = {
  is_anonymous: boolean;
  user_id: string | null;
  user_login: string | null;
  user_name: string | null;
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  message: string;
  bits: number;
};

export type raidEvent = {
  from_broadcaster_user_id: string;
  from_broadcaster_user_login: string;
  from_broadcaster_user_name: string;
  to_broadcaster_user_id: string;
  to_broadcaster_user_login: string;
  to_broadcaster_user_name: string;
  viewers: number;
};

export type banEvent = {
  user_id: string;
  user_login: string;
  user_name: string;
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  moderator_user_id: string;
  moderator_user_login: string;
  moderator_user_name: string;
  reason: string;
  banned_at: string;
  ends_at: string;
  is_perminent: boolean;
};

export type unbanEvent = {
  user_id: string;
  user_login: string;
  user_name: string;
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  moderator_user_id: string;
  moderator_user_login: string;
  moderator_user_name: string;
};

export type moderatorAddEvent = {
  user_id: string;
  user_login: string;
  user_name: string;
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
};

export type moderatorRemoveEvent = {
  user_id: string;
  user_login: string;
  user_name: string;
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
};

export type guestStarSessionBeginEvent = {
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  session_id: string;
  started_at: string;
};

export type guestStarSessionEndEvent = {
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  session_id: string;
  started_at: string;
  ended_at: string;
};

export type guestStarGuestUpdateEvent = {
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  session_id: string;
  moderator_user_id: string;
  moderator_user_login: string;
  moderator_user_name: string;
  guest_user_id: string;
  guest_user_login: string;
  guest_user_name: string;
  slot_id: string | null;
  state: "invited" | "ready" | "backstage" | "live" | "removed";
};

export type guestStarSlotUpdateEvent = {
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  session_id: string;
  moderator_user_id: string;
  moderator_user_login: string;
  moderator_user_name: string;
  guest_user_id: string;
  guest_user_login: string;
  guest_user_name: string;
  slot_id: string | null;
  host_video_enabled: boolean;
  bost_audio_enabled: boolean;
  host_volume: number;
};

export type guestStarSettingsUpdateEvent = {
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  is_moderator_send_live_enabled: boolean;
  slot_count: number;
  is_browser_source_audio_enabled: boolean;
  group_layout: "tilted" | "screenshare";
};

export type pollBeginEvent = {
  id: string;
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  title: string;
  choices: {
    id: string;
    title: string;
    bits_vote: number;
    channel_points_vote: number;
    votes: number;
  }[];
  bits_voting: {
    is_enabled: false;
    amount_per_vote: 0;
  };
  channel_points_voting: {
    is_enabled: boolean;
    amount_per_vote: number;
  };
  started_at: string;
  ends_at: string;
};

export type pollProgressEvent = {
  id: string;
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  title: string;
  choices: {
    id: string;
    title: string;
    bits_vote: number;
    channel_points_vote: number;
    votes: number;
  }[];
  bits_voting: {
    is_enabled: false;
    amount_per_vote: 0;
  };
  channel_points_voting: {
    is_enabled: boolean;
    amount_per_vote: number;
  };
  started_at: string;
  ends_at: string;
};

export type pollEndEvent = {
  id: string;
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  title: string;
  choices: {
    id: string;
    title: string;
    bits_vote: number;
    channel_points_vote: number;
    votes: number;
  }[];
  bits_voting: {
    is_enabled: false;
    amount_per_vote: 0;
  };
  channel_points_voting: {
    is_enabled: boolean;
    amount_per_vote: number;
  };
  status: "completed" | "archived" | "terminated";
  started_at: string;
  ends_at: string;
};

export type channelPointsCustomRewardAddEvent = {
  id: string;
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  is_enabled: boolean;
  is_paused: boolean;
  is_in_stock: boolean;
  title: string;
  cost: number;
  prompt: string;
  is_user_input_required: boolean;
  should_redemptions_skip_request_queue: boolean;
  max_per_stream: {
    is_enabled: boolean;
    value: number;
  };
  max_per_user_per_stream: {
    is_enabled: boolean;
    value: number;
  };
  background_color: string;
  image: {
    url_1x: string;
    url_2x: string;
    url_4x: string;
  } | null;
  default_image: {
    url_1x: string;
    url_2x: string;
    url_4x: string;
  };
  global_cooldown: {
    is_enabled: boolean;
    cooldown: number;
  };
  cooldown_expires_at: string | null;
  redemptions_redeemed_current_stream: number | null;
};

export type channelPointsCustomRewardUpdateEvent = {
  id: string;
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  is_enabled: boolean;
  is_paused: boolean;
  is_in_stock: boolean;
  title: string;
  cost: number;
  prompt: string;
  is_user_input_required: boolean;
  should_redemptions_skip_request_queue: boolean;
  max_per_stream: {
    is_enabled: boolean;
    value: number;
  };
  max_per_user_per_stream: {
    is_enabled: boolean;
    value: number;
  };
  background_color: string;
  image: {
    url_1x: string;
    url_2x: string;
    url_4x: string;
  } | null;
  default_image: {
    url_1x: string;
    url_2x: string;
    url_4x: string;
  };
  global_cooldown: {
    is_enabled: boolean;
    cooldown: number;
  };
  cooldown_expires_at: string | null;
  redemptions_redeemed_current_stream: number | null;
};

export type channelPointsCustomRewardRemoveEvent = {
  id: string;
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  is_enabled: boolean;
  is_paused: boolean;
  is_in_stock: boolean;
  title: string;
  cost: number;
  prompt: string;
  is_user_input_required: boolean;
  should_redemptions_skip_request_queue: boolean;
  max_per_stream: {
    is_enabled: boolean;
    value: number;
  };
  max_per_user_per_stream: {
    is_enabled: boolean;
    value: number;
  };
  background_color: string;
  image: {
    url_1x: string;
    url_2x: string;
    url_4x: string;
  } | null;
  default_image: {
    url_1x: string;
    url_2x: string;
    url_4x: string;
  };
  global_cooldown: {
    is_enabled: boolean;
    cooldown: number;
  };
  cooldown_expires_at: string | null;
  redemptions_redeemed_current_stream: number | null;
};

export type channelPointsCustomRewardRedemptionAddEvent = {
  id: string;
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  user_id: string;
  user_login: string;
  user_name: string;
  user_input: string;
  status: "unknown" | "unfulfilled" | "fulfilled" | "canceled";
  reward: {
    id: string;
    title: string;
    cost: number;
    prompt: string;
  };
  redeemed_at: string;
};

export type channelPointsCustomRewardRedemptionUpdateEvent = {
  id: string;
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  user_id: string;
  user_login: string;
  user_name: string;
  user_input: string;
  status: "unknown" | "unfulfilled" | "fulfilled" | "canceled";
  reward: {
    id: string;
    title: string;
    cost: number;
    prompt: string;
  };
  redeemed_at: string;
};

export type predictionBeginEvent = {
  id: string;
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  title: string;
  outcomes: {
    id: string;
    title: string;
    color: string;
    users: string;
    channel_points: number;
    top_predictors: {
      user_id: string;
      user_login: string;
      user_name: string;
      channel_points_won: number;
      channel_points_used: number;
    }[];
  }[];
  started_at: string;
  locks_at: string;
};

export type predictionProgressEvent = {
  id: string;
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  title: string;
  outcomes: {
    id: string;
    title: string;
    color: string;
    users: string;
    channel_points: number;
    top_predictors: {
      user_id: string;
      user_login: string;
      user_name: string;
      channel_points_won: number;
      channel_points_used: number;
    }[];
  }[];
  started_at: string;
  locks_at: string;
};

export type predictionLockEvent = {
  id: string;
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  title: string;
  outcomes: {
    id: string;
    title: string;
    color: string;
    users: string;
    channel_points: number;
    top_predictors: {
      user_id: string;
      user_login: string;
      user_name: string;
      channel_points_won: number;
      channel_points_used: number;
    }[];
  }[];
  started_at: string;
  locked_at: string;
};

export type predictionEndEvent = {
  id: string;
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  title: string;
  outcomes: {
    id: string;
    title: string;
    color: string;
    users: string;
    channel_points: number;
    top_predictors: {
      user_id: string;
      user_login: string;
      user_name: string;
      channel_points_won: number;
      channel_points_used: number;
    }[];
  }[];
  started_at: string;
  ended_at: string;
};

export type charityDonationEvent = {
  id: string;
  campaign_id: string;
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  user_id: string;
  user_login: string;
  user_name: string;
  charity_name: string;
  charity_description: string;
  charity_logo: string;
  charity_website: string;
  amount: {
    value: number;
    decimal_places: number;
    currency: string;
  };
};

export type charityCampaignStartEvent = {
  id: string;
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  charity_name: string;
  charity_description: string;
  charity_logo: string;
  charity_website: string;
  current_amount: {
    value: number;
    decimal_places: number;
    currency: string;
  };
  target_amount: {
    value: number;
    decimal_places: number;
    currency: string;
  };
  started_at: string;
};

export type charityCampaignProgressEvent = {
  id: string;
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  charity_name: string;
  charity_description: string;
  charity_logo: string;
  charity_website: string;
  current_amount: {
    value: number;
    decimal_places: number;
    currency: string;
  };
  target_amount: {
    value: number;
    decimal_places: number;
    currency: string;
  };
};

export type charityCampaignStopEvent = {
  id: string;
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  charity_name: string;
  charity_description: string;
  charity_logo: string;
  charity_website: string;
  current_amount: {
    value: number;
    decimal_places: number;
    currency: string;
  };
  target_amount: {
    value: number;
    decimal_places: number;
    currency: string;
  };
  stopped_at: string;
};

export type dropEntitlementGrantEvent = {
  id: string;
  data: {
    organization_id: string;
    category_id: string;
    category_name: string;
    campaign_id: string;
    user_id: string;
    user_login: string;
    user_name: string;
    entitlement_id: string;
    benefit_id: string;
    created_at: string;
  };
}[];

export type extensionBitsTransactionCreateEvent = {
  extension_client_id: string;
  id: string;
  user_id: string;
  user_login: string;
  user_name: string;
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  product: {
    name: string;
    bits: number;
    sku: string;
    in_development: boolean;
  };
};

export type goalsEvent = {
  id: string;
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  type:
    | "follow"
    | "subscription"
    | "subscription_count"
    | "new_subscription"
    | "new_subscription_count";
  description: string;
  is_achieved?: boolean;
  current_amount: number;
  target_amount: number;
  started_at: string;
  ended_at?: string;
};

export type hypeTrainBeginEvent = {
  id: string;
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  total: number;
  progress: number;
  goal: number;
  top_contributions: {
    user_id: string;
    user_login: string;
    user_name: string;
    type: "bits" | "subscription" | "other";
    total: number;
  };
  last_contribution: {
    user_id: string;
    user_login: string;
    user_name: string;
    type: "bits" | "subscription" | "other";
    total: number;
  };
  level: number;
  started_at: string;
  expires_at: string;
};

export type hypeTrainProgressEvent = {
  id: string;
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  total: number;
  progress: number;
  goal: number;
  top_contributions: {
    user_id: string;
    user_login: string;
    user_name: string;
    type: "bits" | "subscription" | "other";
    total: number;
  };
  last_contribution: {
    user_id: string;
    user_login: string;
    user_name: string;
    type: "bits" | "subscription" | "other";
    total: number;
  };
  level: number;
  started_at: string;
  expires_at: string;
};

export type hypeTrainEndEvent = {
  id: string;
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  level: number;
  total: number;
  top_contributions: {
    user_id: string;
    user_login: string;
    user_name: string;
    type: "bits" | "subscription" | "other";
    total: number;
  };
  started_at: string;
  ended_at: string;
  cooldown_ends_at: string;
};

export type shieldModeBeginEvent = {
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  moderator_user_id: string;
  moderator_user_login: string;
  moderator_user_name: string;
  started_at: string;
};
export type shieldModeEndEvent = {
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  moderator_user_id: string;
  moderator_user_login: string;
  moderator_user_name: string;
  ended_at: string;
};

export type shoutoutCreateEvent = {
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  to_broadcaster_user_id: string;
  to_broadcaster_user_login: string;
  to_broadcaster_user_name: string;
  moderator_user_id: string;
  moderator_user_login: string;
  moderator_user_name: string;
  viewer_count: number;
  started_at: string;
  cooldown_ends_at: string;
  target_cooldown_ends_at: string;
};

export type shoutoutReceiveEvent = {
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  from_broadcaster_user_id: string;
  from_broadcaster_user_login: string;
  from_broadcaster_user_name: string;
  viewer_count: number;
  started_at: string;
};

export type streamOnline = {
  id: streamOnline;
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  type: "live" | "playlist" | "watch_party" | "premiere" | "rerun";
  started_at: string;
};

export type streamOffline = {
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
};

export type userAuthorizationGrantEvent = {
  client_id: string;
  user_id: string;
  user_login: string;
  user_name: string;
};

export type userAuthorizationRevokeEvent = {
  client_id: string;
  user_id: string;
  user_login: string;
  user_name: string;
};

export type userUpdateEvent = {
  user_id: string;
  user_login: string;
  user_name: string;
  email: string;
  email_verified: boolean;
  description: string;
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
  public subscribe(
    type: eventType,
    version: subVersion,
    condition: conditions,
  ): Promise<object>;
  public on(event: "debug", listener: (msg: string) => void): this;
  public on(event: "raw", listener: (packet: object) => void): this;
  public on(event: "online", listener: () => void): this;

  public on<K extends keyof Events>(
    event: K,
    listener: (...args: Events[K]) => Awaitable<void>,
  ): this;
  public once<K extends keyof Events>(
    event: K,
    listener: (...args: Events[K]) => Awaitable<void>,
  ): this;
  public off<K extends keyof Events>(
    event: K,
    listener: (...args: Events[K]) => Awaitable<void>,
  ): this;

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

  public post(
    url: string,
    headers: object,
    data: object,
  ): Promise<string | object>;
  public patch(
    url: string,
    headers: object,
    data: object,
  ): Promise<string | object>;
  public get(url: string): Promise<string | object>;
  public delete(url: string): Promise<string | object>;

  public on(
    event: "result",
    listener: (
      type: "post" | "patch" | "get" | "delete",
      url: string,
      json: object,
    ) => void,
  ): this;
}
