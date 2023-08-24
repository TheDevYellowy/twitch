import { EventEmitter } from "node:events";
import { WebSocket } from "ws";
import { Application } from 'express';

export type Awaitable<T> = T | PromiseLike<T>;

// EVENTSUB TYPINGS

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
  | "stream.online"
  | "stream.offline"
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

export type EventSubOptions = {
  api: {
    API: API | undefined;
    customTokens: null | boolean;
    client_token: null | string;
    refresh_token: null | string;
  }
};

export type connectOptions = {
  type: "websocket"
} | {
  type: "webhook";
  callback: string;
  secret: string;
  port: undefined | number;
};

export class EventSub extends EventEmitter {
  constructor(
    client_id: string,
    client_secret: string,
    options: EventSubOptions,
  );

  public type: "websocket" | "webhook";
  public websocket: websocket | null;
  public webhook: webhook | null;

  public api: API;

  public connect(options: connectOptions): webhook | websocket;

  public subscribe(
    type: eventType,
    version: subVersion,
    condition: conditions,
    cHeaders: {
      [key: string]: string;
    },
  ): Promise<object>;
  public on(event: "debug", listener: (msg: string) => void): this;
  public on(event: "raw", listener: (packet: object) => void): this;
  public on(event: "online", listener: () => void): this;
  public on(event: "revocation", listener: (reason: "user_removed" | "authorization_revoked" | "notification_failures_exceeded" | "version_removed") => void): this;

  public on<K extends keyof Events>(
    event: K,
    listener: (...args: Events[K]) => Awaitable<void>
  ): this;
  public once<K extends keyof Events>(
    event: K,
    listener: (...args: Events[K]) => Awaitable<void>
  ): this;
  public off<K extends keyof Events>(
    event: K,
    listener: (...args: Events[K]) => Awaitable<void>
  ): this;
  public emit<K extends keyof Events>(
    event: K,
    listener: (...args: Events[K]) => Awaitable<void>
  ): boolean;

  
  private debug(msg: string): void;
}

export class webhook {
  constructor(parent: EventSub, callback: string, secret: string, port: number | undefined);
  public parent: EventSub;
  public secret: string;
  public app: Application;

  private callback: string;

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
  public emit<K extends keyof Events>(
    event: K,
    listener: (...args: Events[K]) => Awaitable<void>,
  ): boolean;
}

export class websocket {
  constructor(parent: EventSub);
  public parent: EventSub;
  public connection: WebSocket | null;
  public connectedAt: null | number;
  public id: null | string;
  
  public connect(url: null | string): void;
  private onOpen(): void;
  private onMessage({ data }): void;
  private onPacket(packet: object): void;

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
  public emit<K extends keyof Events>(
    event: K,
    listener: (...args: Events[K]) => Awaitable<void>,
  ): boolean;
}

// API TYPINGS

export type headers = {
  "Authorization": string;
  "Client-Id": string;
};

export type header = {
  [header: string]: string;
};

export type label = {
  "id": "DrugsIntoxication" | "SexualThemes" | "ViolentGraphic" | "Gambling" | "ProfanityVulgarity";
  "is_enabled": boolean;
}

export interface Get {
  'analytics/extensions': {
    "data": {
      "extension_id": string;
      "URL": string;
      "type": string;
      "date_range": {
        "started_at": string;
        "ended_at": string;
      }
    }[]
  };
  'analytics/games': {
    "data": {
      "game_id": string;
      "URL": string;
      "type": string;
      "date_range": {
        "started_at": string;
        "ended_at": string;
      }
    }[]
  };
  'bits/leaderboard': {
    "data": {
      "user_id": string;
      "user_login": string;
      "user_name": string;
      "rank": number;
      "score": number;
    }[];
    "date_range": {
      "started_at": string;
      "ended_at": string;
    };
    "total": number;
  };
  'bits/cheermotes': {
    "data": {
      "prefix": string;
      "tiers": {
        "min_bits": number;
        "id": string;
        "color": string;
        "images": {
          "dark": {
            "animated": {
              "1": string;
              "1.5": string;
              "2": string;
              "3": string;
              "4": string;
            };
            "static": {
              "1": string;
              "1.5": string;
              "2": string;
              "3": string;
              "4": string;
            }
          };
          "light": {
            "animated": {
              "1": string;
              "1.5": string;
              "2": string;
              "3": string;
              "4": string;
            };
            "static": {
              "1": string;
              "1.5": string;
              "2": string;
              "3": string;
              "4": string;
            }
          };
        };
        "can_cheer": boolean;
        "show_in_bits_card": boolean;
      }[];
      "type": string;
      "order": number;
      "last_updated": string;
      "is_charitable": boolean;
    }[];
  };
  'extensions/transactions': {
    "data": {
      "id": string;
      "timestamp": string;
      "broadcaster_id": string;
      "broadcaster_login": string;
      "broadcaster_name": string;
      "user_id": string;
      "user_login": string;
      "user_name": string;
      "product_type": string;
      "product_data": {
        "domain": string;
        "sku": string;
        "cost": {
          "amount": number;
          "type": string;
        };
        "inDevelopment": boolean;
        "displayName": string;
        "expiration": string;
        "broadcast": false
      }
    }[];
  };
  'channels': {
    "data": {
      "broadcaster_id": string;
      "broadcaster_login": string;
      "broadcaster_name": string;
      "broadcaster_language": string;
      "game_id": string;
      "game_name": string;
      "title": string;
      "delay": number;
      "tags": string[];
      "content_classification_labels": string[];
      "is_branded_content": boolean;
    }[];
  };
  'channels/editors': {
    "data": {
      "user_id": string;
      "user_name": string;
      "created_at": string;
    }[];
  };
  'channels/followed': {
    total: number;
    "data": {
      "broadcaster_id": string;
      "broadcaster_login": string;
      "broadcaster_name": string;
      "followed_at": string;
    }[];
  };
  'channels/followers': {
    "total": number;
    "data": {
      "broadcaster_id": string;
      "broadcaster_login": string;
      "broadcaster_name": string;
      "followed_at": string;
    }[];
  };
  'channel_points/custom_rewards': {
    "data": {
      "broadcaster_name": string;
      "broadcaster_login": string;
      "broadcaster_id": string;
      "id": string;
      "title": string;
      "prompt": string;
      "cost": number;
      "image": {
        "url_1x": string;
        "url_2x": string;
        "url_4x": string;
      } | null;
      "default_image": {
        "url_1x": string;
        "url_2x": string;
        "url_4x": string;
      };
      "background_color": string;
      "is_enabled": boolean;
      "is_user_input_required": boolean;
      "max_per_stream_setting": {
        "is_enabled": boolean;
        "max_per_stream": number;
      };
      "max_per_user_per_stream_settings": {
        "is_enabled": boolean;
        "max_per_user_per_stream": number;
      };
      "global_cooldown_setting": {
        "is_enabled": boolean;
        "global_cooldown_seconds": number;
      };
      "is_paused": boolean;
      "is_in_stock": boolean;
      "should_redemptions_skip_request_queue": boolean;
      "redemptions_redeemed_current_stream": number | null;
      "cooldown_expires_at": string | null;
    }[];
  };
  'custom_rewards/redemptions': {
    "data": {
      "broadcaster_id": string;
      "broadcaster_login": string;
      "broadcaster_name": string;
      "id": string;
      "user_login": string;
      "user_id": string;
      "user_name": string;
      "user_input": string;
      "status": "CANCELED" | "FULFILLED" | "UNFULFILLED";
      "redeemed_at": string;
      "reward": {
        "id": string;
        "title": string;
        "prompt": string;
        "cost": number;
      }
    }[];
  };
  'charity/campaigns': {
    "data": {
      "id": string;
      "broadcaster_id": string;
      "broadcaster_login": string;
      "broadcaster_name": string;
      "charity_name": string;
      "charity_description": string;
      "charity_logo": string;
      "charity_website": string;
      "current_amount": {
        "value": number;
        "decimal_places": number;
        "currency": string;
      };
      "target_amount": {
        "value": number;
        "decimal_places": number;
        "currency": string;
      }
    }[];
  };
  'charity/donations': {
    "data": {
      "id": string;
      "campaign_id": string;
      "user_id": string;
      "user_login": string;
      "user_name": string;
      "amount": {
        "value": number;
        "decimal_places": number;
        "currency": string;
      }
    }[];
  };
  'chat/chatters': {
    total: number;
    "data": {
      "user_id": string;
      "user_login": string;
      "user_name": string;
    }[];
  };
  'chat/emotes': {
    template: string;
    "data": {
      "id": string;
      "name": string;
      "images": {
        "url_1x": string;
        "url_2x": string;
        "url_4x": string;
      };
      "tier": string | "1000" | "2000" | "3000" | "Prime";
      "emote_type": "bitstier" | "follower" | "subscriptions";
      "emote_set_id": string;
      "format": string[];
      "scale": string[];
      "theme_mode": string[];
    }[];
  };
  'emotes/global': {
    template: string;
    "data": {
      "id": string;
      "name": string;
      "images": {
        "url_1x": string;
        "url_2x": string;
        "url_4x": string;
      };
      "format": string[];
      "scale": string[];
      "theme_mode": string[];
    }
  };
  'chat/emotes/set': {
    template: string;
    "data": {
      "id": string;
      "name": string;
      "images": {
        "url_1x": string;
        "url_2x": string;
        "url_4x": string;
      };
      "emote_type": "bitstier" | "follower" | "subscriptions";
      "emote_set_id": string;
      "owner_id": string;
      "format": string[];
      "scale": string[];
      "theme_mode": string[];
    }
  };
  'chat/badges': {
    "data": {
      "set_id": string;
      "versions": {
        "id": string;
        "image_url_1x": string;
        "image_url_2x": string;
        "image_url_4x": string;
        "title": string;
        "description": string;
        "click_action": string;
        "click_url": string;
      }[];
    }[];
  };
  'chat/badges/global': {
    "data": {
      "set_id": string;
      "versions": {
        "id": string;
        "image_url_1x": string;
        "image_url_2x": string;
        "image_url_4x": string;
        "title": string;
        "description": string;
        "click_action": string;
        "click_url": string;
      }[];
    }[];
  };
  'chat/settings': {
    "data": {
      "broadcaster_id": string;
      "slow_mode": boolean;
      "slow_mode_wait_time": number | null;
      "follower_mode": boolean;
      "follower_mode_duration": number | null;
      "subscriber_mode": boolean;
      "emote_mode": boolean;
      "unique_chat_mode": boolean;
      "non_moderator_chat_delay": boolean;
      "non_moderator_chat_delay_duration": boolean | null;
    }[];
  };
  'chat/color': {
    "data": {
      "user_id": string;
      "user_name": string;
      "user_login": string;
      "color": string;
    }[];
  };
  'clips': {
    "data": {
      "id": string;
      "url": string;
      "embed_url": string;
      "broadcaster_id": string;
      "broadcaster_name": string;
      "creator_id": string;
      "creator_name": string;
      "video_id": string;
      "game_id": string;
      "language": string;
      "title": string;
      "view_count": number;
      "created_at": string;
      "thumbnail_url": string;
      "duration": number;
      "vod_offset": number;
    }[];
  };
  'content_classification_labels': {
    "data": {
      id: string;
      description: string;
      name: string;
    }[];
  };
  'entitlements/drops': {
    "data": {
      "id": string;
      "benefit_id": string;
      "timestamp": string;
      "user_id": string;
      "game_id": string;
      "fulfillment_status": "CLAIMED" | "FULFILLED";
      "last_updated": string;
    }[];
  };
  'extensions/configurations': {
    "data": {
      "segment": "broadcaster" | "developer" | "global";
      "broadcaster_id": string | undefined;
      "content": string;
      "version": string;
    }[];
  };
  'extensions/live': {
    "data": {
      "broadcaster_id": string;
      "broadcaster_name": string;
      "game_name": string;
      "game_id": string;
      "title": string;
    }[];
  };
  'extensions/jwt/secrets': {
    "data": {
      "format_version": number;
      "secrets": {
        "content": string;
        "active_at": string;
        "expires_at": string;
      }[];
    }[];
  };
  'extensions': {
    "data": {
      "author_name": string;
      "bits_enabled": boolean;
      "can_install": boolean;
      "configuration_location": "hosted" | "custom" | "none";
      "description": string;
      "eula_tos_url": string;
      "has_chat_support": string;
      "icon_url": string;
      "icon_urls": {
        [size: string]: string;
      };
      "id": string;
      "name": string;
      "privacy_policy_url": string;
      "request_identity_link": boolean;
      "screenshot_urls": string[];
      "state": "Approved" | "AssetsUploaded" | "Deleted" | "Deprecated" | "InReview" | "InTest" | "PendingAction" | "Rejected" | "Released";
      "subscriptions_support_level": "none" | "optional";
      "summary": string;
      "support_email": string;
      "version": string;
      "viewer_summary": string;
      "views": {
        "mobile": {
          "viewer_url": string
        };
        "panel": {
          "viewer_url": string;
          "height": number;
          "can_link_external_content": boolean;
        };
        "video_overlay": {
          "viewer_url": string;
          "can_link_external_content": boolean;
        };
        "component": {
          "viewer_url": string;
          "aspect_ratio_x": number;
          "aspect_ratio_y": number;
          "autoscale": boolean;
          "scale_pixels": number | undefined;
          "target_height": number;
          "can_link_external_content": boolean;
        };
        "config": {
          "viewer_url": string;
          "can_link_external_content": boolean;
        }
      }
      "allowed_config_urls": string[];
      "allowed_panel_urls": string[];
    }[];
  };
  'extensions/released': {
    "data": {
      "author_name": string;
      "bits_enabled": boolean;
      "can_install": boolean;
      "configuration_location": "hosted" | "custom" | "none";
      "description": string;
      "eula_tos_url": string;
      "has_chat_support": string;
      "icon_url": string;
      "icon_urls": {
        [size: string]: string;
      };
      "id": string;
      "name": string;
      "privacy_policy_url": string;
      "request_identity_link": boolean;
      "screenshot_urls": string[];
      "state": "Approved" | "AssetsUploaded" | "Deleted" | "Deprecated" | "InReview" | "InTest" | "PendingAction" | "Rejected" | "Released";
      "subscriptions_support_level": "none" | "optional";
      "summary": string;
      "support_email": string;
      "version": string;
      "viewer_summary": string;
      "views": {
        "mobile": {
          "viewer_url": string
        };
        "panel": {
          "viewer_url": string;
          "height": number;
          "can_link_external_content": boolean;
        };
        "video_overlay": {
          "viewer_url": string;
          "can_link_external_content": boolean;
        };
        "component": {
          "viewer_url": string;
          "aspect_ratio_x": number;
          "aspect_ratio_y": number;
          "autoscale": boolean;
          "scale_pixels": number | undefined;
          "target_height": number;
          "can_link_external_content": boolean;
        };
        "config": {
          "viewer_url": string;
          "can_link_external_content": boolean;
        }
      }
      "allowed_config_urls": string[];
      "allowed_panel_urls": string[];
    }[];
  };
  'bits/extensions': {
    "data": {
      "sku": string;
      "cost": {
        "amount": number;
        "type": "bits";
      };
      "in_development": boolean;
      "display_name": string;
      "expiration": string;
      "is_broadcast": boolean;
    }[];
  };
  'eventsub/subscriptions': {
    "data": {
      "id": string;
      "status":
          "enabled"
        | "webhook_callback_verification_pending"
        | "webhook_callback_verification_failed"
        | "notification_failures_exceeded"
        | "authorization_revoked"
        | "moderator_removed"
        | "user_removed"
        | "version_removed"
        | "websocket_disconnected"
        | "websocket_failed_ping_pong"
        | "websocket_received_inbound_traffic"
        | "websocket_connection_unused"
        | "websocket_internal_error"
        | "websocket_network_timeout"
        | "websocket_network_error";
      "type": eventType;
      "version": string;
      "condition": {
        "method": "webhook";
        "callback": string;
      } | {
        "method": "websocket";
        "session_id": string;
        "connected_at": string;
        "disconnected_at": string;
      };
      "cost": number;
    };
    "total": number;
    "total_cost": number;
    "max_total_cost": number;
  };
  'games/top': {
    "data": {
      "id": string;
      "name": string;
      "box_art_url": string;
      "igdb_id": string;
    }[];
  };
  'games': {
    "data": {
      "id": string;
      "name": string;
      "box_art_url": string;
      "igdb_id": string;
    }[];
  };
  'goals': {
    "data": {
      "id": string;
      "broadcaster_id": string;
      "broadcaster_name": string;
      "broadcaster_login": string;
      "type": "follower" | "subscription" | "subscription_count" | "new_subscription" | "new_subscription_count";
      "description": string;
      "current_amount": number;
      "target_amount": number;
      "created_at": string;
    }[];
  };
  'guest_star/channel_settings': {
    "data": {
      "is_moderator_send_live_enabled": boolean;
      "slot_count": number;
      "is_browser_source_audio_enabled": boolean;
      "group_layout": "TILED_LAYOUT" | "SCREENSHARE_LAYOUT";
      "browser_source_token": string;
    }[];
  };
  'guest_star/session': {
    "data": {
      "id": string;
      "guests": {
        "slot_id": string;
        "is_live": boolean;
        "user_id": string;
        "user_display_name": string;
        "user_login": string;
        "volume": number;
        "assigned_at": string;
        "audio_settings": {
          "is_available": boolean;
          "is_host_enabled": boolean;
          "is_guest_enabled": boolean;
        };
        "video_settings": {
          "is_available": boolean;
          "is_host_enabled": boolean;
          "is_guest_enabled": boolean;
        }
      }
    }
  };
  'guest_star/invites': {
    "data": {
      "user_id": string;
      "invited_at": string;
      "status": "INVITED" | "ACCEPTED" | "READY";
      "is_video_enabled": boolean;
      "is_audio_enabled": boolean;
      "is_video_available": boolean;
      "is_audio_available": boolean;
    }[];
  };
  'hypetrain/events': {
    "data": {
      "id": string;
      "event_type": string;
      "version": string;
      "event_timestamp": string;
      "event_data": {
        "broadcaster_id": string;
        "cooldown_end_time": string;
        "expires_at": string;
        "goal": number;
        "id": string;
        "last_contribution": {
          "total": number;
          "type": "BITS" | "SUBS" | "OTHER";
          "user": string;
        };
        "level": number;
        "started_at": string;
        "top_contributions": {
          "total": number;
          "type": "BITS" | "SUBS" | "OTHER";
          "user": string;
        }[];
      }
    }[];
  };
  'moderation/automod/settings': {
    "data": {
      "broadcaster_id": string;
      "moderator_id": string;
      "overall_level": number | null;
      "disability": number;
      "aggression": number;
      "sexuality_sex_or_gender": number;
      "misogyny": number;
      "bullying": number;
      "swearing": number;
      "race_ethnicity_or_religion": number;
      "sex_based_terms": number;
    }[];
  };
  'moderation/banned': {
    "data": {
      "user_id": string;
      "user_name": string;
      "user_login": string;
      "expires_at": string;
      "created_at": string;
      "reason": string;
      "moderator_id": string;
      "moderator_name": string;
      "moderator_login": string; 
    }[];
  };
  'moderation/blocked_terms': {
    "data": {
      "broadcaster_id": string;
      "moderator_id": string;
      "id": string;
      "text": string;
      "created_at": string;
      "updated_at": string;
      "expires_at": string | null;
    }[];
  };
  'moderation/moderators': {
    "data": {
      "user_id": string;
      "user_name": string;
      "user_login": string;
    }[];
  };
  'channels/vips': {
    "data": {
      "user_id": string;
      "user_name": string;
      "user_login": string;
    }[];
  };
  'moderation/shield_mode': {
    "data": {
      "is_active": boolean;
      "moderator_id": string;
      "moderator_name": string;
      "moderator_login": string;
      "last_activated_at": string;
    }[];
  };
  'polls': {
    "data": {
      "id": string;
      "broadcaster_id": string;
      "broadcaster_name": string;
      "broadcaster_login": string;
      "title": string;
      "choices": {
        "id": string;
        "title": string;
        "votes": number;
        "channel_point_votes": number;
        "bits_votes": 0;
      }[];
      "bits_voting_enabled": false;
      "bits_per_vote": 0;
      "channel_points_voting_enabled": boolean;
      "channel_points_per_vote": number;
      "status": "ACTIVE" | "COMPLETED" | "TERMINATED" | "ARCHIVED" | "MODERATED" | "INVALID";
      "duration": number;
      "started_at": string;
      "ended_at": string | null;
    }[];
  };
  'predictions': {
    "data": {
      "id": string;
      "broadcaster_id": string;
      "broadcaster_name": string;
      "broadcaster_login": string;
      "title": string;
      "winning_outcome_id": string | null;
      "outcomes": {
        "id": string;
        "title": string;
        "users": number;
        "channel_points": number;
        "top_predictors": {
          "user_id": string;
          "user_name": string;
          "user_login": string;
          "channel_points_used": number;
          "channel_points_won": number;
        } | null;
        "color": "BLUE" | "PINK";
      }[];
      "prediction_window": number;
      "status": "ACTIVE" | "CANCELED" | "LOCKED" | "RESOLVED";
      "created_at": string;
      "ended_at": string | null;
      "locked_at": string | null;
    }[];
  };
  'schedule': {
    "data": {
      "segments": {
        "id": string;
        "start_time": string;
        "end_time": string;
        "title": string;
        "canceled_until": string | null;
        "category": {
          "id": string;
          "name": string;
        } | null;
        "is_recurring": boolean;
      }[];
      "broadcaster_id": string;
      "broadcaster_name": string;
      "broadcaster_login": string;
      "vacation": {
        "start_time": string;
        "end_time": string;
      } | null;
    }
  };
  'schedule/icalendar': string;
  'search/categories': {
    "data": {
      "id": string;
      "name": string;
      "box_art_url": string;
    }[];
  };
  'search/channels': {
    "data": {
      "broadcaster_language": string;
      "broadcaster_login": string;
      "display_name": string;
      "game_id": string;
      "game_name": string;
      "id": string;
      "is_live": boolean;
      "tag_ids": string[];
      "tags": string[];
      "thumbnail_url": string;
      "title": string;
      "started_at": string;
    }[];
  };
  'streams': {
    "data": {
      "id": string;
      "user_id": string;
      "user_name": string;
      "user_login": string;
      "game_id": string;
      "game_name": string;
      "type": "all" | "live";
      "title": string;
      "tags": string[];
      "viewer_count": number;
      "started_at": string;
      "language": string;
      "thumbnail_url": string;
      "tag_ids": string[];
      "is_mature": boolean;
    }[];
  };
  'streams/followed': {
    "data": {
      "id": string;
      "user_id": string;
      "user_name": string;
      "user_login": string;
      "game_id": string;
      "game_name": string;
      "type": "all" | "live";
      "title": string;
      "tags": string[];
      "viewer_count": number;
      "started_at": string;
      "language": string;
      "thumbnail_url": string;
      "tag_ids": string[];
    }[];
  };
  'streams/markers': {
    "data": {
      "user_id": string;
      "user_name": string;
      "user_login": string;
      "videos": {
        "video_id": string;
        "markers": {
          "id": string;
          "created_at": string;
          "description": string;
          "position_seconds": number;
          "URL": string;
        }[];
      }[];
    }[];
  };
  'subscriptions': {
    "data": {
      "broadcaster_id": string;
      "broadcaster_name": string;
      "broadcaster_login": string;
      "gifter_id": string;
      "gifter_name": string;
      "gifter_login": string;
      "is_gift": boolean;
      "plan_name": string;
      "tier": "1000" | "2000" | "3000";
      "user_id": string;
      "user_name": string;
      "user_login": string;
    }[];
  };
  'subscriptions/user': {
    "data": {
      "broadcaster_id": string;
      "broadcaster_name": string;
      "broadcaster_login": string;
      "is_gift": boolean;
      "tier": "1000" | "2000" | "3000";
    }[];
  };
  'tags/streams': {
    "data": {
      "tag_id": string;
      "is_auto": boolean;
      "localization_names": {
        [locale: string]: string;
      };
      "localization_descriptions": {
        [locale: string]: string;
      };
    }[];
  };
  'streams/tags': {
    "data": {
      "tag_id": string;
      "is_auto": boolean;
      "localization_names": {
        [locale: string]: string;
      };
      "localization_descriptions": {
        [locale: string]: string;
      };
    }[];
  };
  'teams/channel': {
    "data": {
      "broadcaster_id": string;
      "broadcaster_name": string;
      "broadcaster_login": string;
      "background_image_url": string | null;
      "banner": string | null;
      "created_at": string;
      "updated_at": string;
      "info": string;
      "thumbnail_url": string;
      "team_name": string;
      "team_display_name": string;
      "id": string;
    }[];
  };
  'teams': {
    "data": {
      "users": {
        "user_id": string;
        "user_name": string;
        "user_login": string;
      }[];
      "background_image_url": string | null;
      "banner": string | null;
      "created_at": string;
      "updated_at": string;
      "info": string;
      "thumbnail_url": string;
      "team_name": string;
      "team_display_name": string;
      "id": string;
    }[];
  };
  'users': {
    "data": {
      "id": string;
      "login": string;
      "display_name": string;
      "type": "" | "admin" | "global_mod" | "staff";
      "broadcaster_type": "" | "affiliate" | "partner";
      "description": string;
      "profile_image_url": string;
      "offline_image_url": string;
      "view_count": number;
      "email": string | undefined;
      "created_at": string;
    }[];
  };
  'users/blocks': {
    "data": {
      "user_id": string;
      "user_name": string;
      "user_login": string;
    }[];
  };
  'users/extensions/list': {
    "data": {
      "id": string;
      "version": string;
      "name": string;
      "can_activate": boolean;
      "type": string[];
    }[];
  };
  'users/extensions': {
    "data": {
      "panel": {
        [number: string]: {
          "active": false;
        } | {
          "active": true;
          "id": string;
          "version": string;
          "name": string;
        };
      };
      "overlay": {
        [number: string]: {
          "active": false;
        } | {
          "active": true;
          "id": string;
          "version": string;
          "name": string;
        };
      };
      "component": {
        [number: string]: {
          "active": false;
        } | {
          "active": true;
          "id": string;
          "version": string;
          "name": string;
          "x": number;
          "y": number;
        };
      }
    };
  };
  'videos': {
    "data": {
      "id": string;
      "stream_id": string | null;
      "user_id": string;
      "user_name": string;
      "user_login": string;
      "title": string;
      "description": string;
      "created_at": string;
      "published_at": string;
      "url": string;
      "thumbnail_url": string;
      "viewable": "public";
      "view_count": number;
      "language": string;
      "type": "archive" | "highlight" | "upload";
      "duration": string;
      "muted_segments": {
        "duration": number;
        "offset": number;
      }[] | null;
    }[];
  }
}

export interface Delete {
  'channel_points/custom_rewards': {}
  'eventsub/subscriptions': {}
  'guest_star/session': {
    'data': {
      'id': string;
      'guests': {
        'slot_id': string;
        'is_live': boolean;
        'user_id': string;
        'user_login': string;
        'user_display_name': string;
        'volume': number;
        'assigned_at': string;
        'audio_settings': {
          'is_host_enabled': boolean;
          'is_guest_enabled': boolean;
          'is_available': boolean;
        }
        'video_settings': {
          'is_host_enabled': boolean;
          'is_guest_enabled': boolean;
          'is_available': boolean;
        }
      }[];
    }[];
  }
  'guest_star/invites': {}
  'guest_star/slot': {}
  'moderation/bans': {}
  'moderation/blocked_terms': {}
  'moderation/chat': {}
  'moderation/moderators': {}
  'channels/vips': {}
  'raids': {}
  'schedule/segment': {}
  'users/blocks': {}
  'videos': { 'data': string[]; }
}

export interface Post {
  'channels/commercial': {
    "broadcaster_id": string;
    "length": number;
  }
  'channel_points/custom_rewards': {
    "title": string;
    "cost": number;
    "prompt"?: string;
    "is_enabled"?: boolean;
    "background_color"?: string;
    "is_user_input_required"?: boolean;
    "is_max_per_stream_enabled"?: boolean;
    "max_per_stream"?: number;
    "is_max_per_user_per_stream_enabled"?: boolean;
    "max_per_user_per_stream"?: number;
    "is_global_cooldown_enabled"?: boolean;
    "global_cooldown_seconds"?: number;
    "should_redemptions_skip_request_queue"?: boolean;
  }
  'chat/announcements': {
    "message": string;
    "color"?: "blue" | "green" | "orange" | "purple" | "primary";
  }
  'chat/shoutouts': {}
  'clips': {}
  'extensions/pubsub': {
    'target': string[];
    'broadcaster_id': string;
    'message': string;
    'is_global_broadcast'?: boolean;
  }
  'extensions/jwt/secrets': {}
  'extensions/chat': {
    'text': string;
    'extension_id': string;
    'extension_version': string;
  }
  'eventsub/subscriptions': {
    'type': eventType;
    'version': 1 | 2 | "beta";
    'condition': conditions;
    'transport': {
      'method': 'webhook';
      'callback': string;
      'secret': string;
    } | {
      'method': 'websocket';
      'session_id': string;
    }
  }
  'guest_star/session': {}
  'guest_star/invites': {}
  'guest_star/slot': {}
  'moderation/enforcements/status': {
    'data': {
      'msg_id': string;
      'msg_text': string;
    }[];
  }
  'moderation/automod/message': {
    'user_id': string;
    'msg_id': string;
    'action': 'ALLOW' | 'DENY';
  }
  'moderation/bans': {
    'data': {
      'user_id': string;
      'duration'?: number;
      'reason'?: string;
    }
  }
  'moderation/blocked_terms': { 'text': string; }
  'moderation/moderators': {}
  'channels/vips': {}
  'polls': {
    'broadcaster_id': string;
    'title': string;
    'choices': {
      'title': string;
    }[];
    'duration': number;
    'channel_points_voting_enabled'?: boolean
    'channel_points_per_vote'?: number;
  }
  'predictions': {
    'broadcaster_id': string;
    'title': string;
    'outcomes': {
      'title': string;
    }[];
    'prediction_window': number;
  }
  'raids': {}
  'schedule/segment': {
    'start_time': string;
    'timezone': string;
    'duration': string;
    'is_reocurring'?: boolean;
    'category_id'?: string;
    'title'?: string;
  }
  'streams/markers': {
    'user_id': string;
    'description'?: string;
  }
  'whispers': {
    'message': string;
  }
}
export interface PostRes {
  'channels/commercial': {
    "data": {
      "length": number;
      "message": string;
      "retry_after": number;
    }[];
  }
  'channel_points/custom_rewards': {
    "data": {
      "broadcaster_name": string;
      "broadcaster_login": string;
      "broadcaster_id": string;
      "id": string;
      "title": string;
      "prompt": string;
      "cost": number;
      "image": {
        "url_1x": string;
        "url_2x": string;
        "url_4x": string;
      } | null;
      "default_image": {
        "url_1x": string;
        "url_2x": string;
        "url_4x": string;
      };
      "background_color": string;
      "is_enabled": boolean;
      "is_user_input_required": boolean;
      "max_per_stream_setting": {
        "is_enabled": boolean;
        "max_per_stream": number;
      };
      "max_per_user_per_stream_settings": {
        "is_enabled": boolean;
        "max_per_user_per_stream": number;
      };
      "global_cooldown_setting": {
        "is_enabled": boolean;
        "global_cooldown_seconds": number;
      };
      "is_paused": boolean;
      "is_in_stock": boolean;
      "should_redemptions_skip_request_queue": boolean;
      "redemptions_redeemed_current_stream": number | null;
      "cooldown_expires_at": string | null;
    }[];
  }
  'chat/announcements': {}
  'chat/shoutouts': {}
  'clips': {
    'data': {
      'edit_url': string;
      'id': string;
    }[];
  }
  'extensions/pubsub': {}
  'extensions/jwt/secrets': {
    'data': {
      'format_version': number;
      'secrets': {
        'content': string;
        'active_at': string;
        'expires_at': string;
      }[];
    }[];
  }
  'extensions/chat': {}
  'eventsub/subscriptions': {
    'data': {
      'id': string;
      'status': 'enabled' | 'webhook_callback_verification_pending';
      'type': eventType;
      'version': 1 | 2 | 'beta';
      'condition': conditions;
      'created_at': string;
      'transport': {
        'method': 'webhook';
        'callback': string;
        'secret': string;
      } | {
        'method': 'websocket';
        'session_id': string;
      };
      'cost': number;
    }[];
    'total': number;
    'total_cost': number;
    'max_total_cost': number;
  }
  'guest_star/session': {
    'data': {
      'id': string;
      'guests': {
        'slot_id': string;
        'is_live': boolean;
        'user_id': string;
        'user_login': string;
        'user_display_name': string;
        'volume': number;
        'assigned_at': string;
        'audio_settings': {
          'is_host_enabled': boolean;
          'is_guest_enabled': boolean;
          'is_available': boolean;
        };
        'video_settings': {
          'is_host_enabled': boolean;
          'is_guest_enabled': boolean;
          'is_available': boolean;
        }
      }[];
    }[];
  }
  'guest_star/invites': {}
  'guest_star/slot': {
    'data': {
      'code': string;
    }
  }
  'moderation/enforcements/status': {
    'data': {
      'msg_id': string;
      'is_permitted': boolean;
    }[];
  }
  'moderation/automod/message': {}
  'moderation/bans': {
    'data': {
      'broadcaster_id': string;
      'moderator_id': string;
      'user_id': string;
      'created_at': string;
      'end_time': string | null;
    }[];
  }
  'moderation/blocked_terms': {
    'data': {
      'broadcaster_id': string;
      'moderator_id': string;
      'id': string;
      'text': string;
      'created_at': string;
      'updated_at': string;
      'expires_at': string | null;
    }[];
  }
  'moderation/moderators': {}
  'channels/vips': {}
  'polls': {
    "data": {
      "id": string;
      "broadcaster_id": string;
      "broadcaster_name": string;
      "broadcaster_login": string;
      "title": string;
      "choices": {
        "id": string;
        "title": string;
        "votes": number;
        "channel_point_votes": number;
        "bits_votes": 0;
      }[];
      "bits_voting_enabled": false;
      "bits_per_vote": 0;
      "channel_points_voting_enabled": boolean;
      "channel_points_per_vote": number;
      "status": "ACTIVE" | "COMPLETED" | "TERMINATED" | "ARCHIVED" | "MODERATED" | "INVALID";
      "duration": number;
      "started_at": string;
      "ended_at": string | null;
    }[];
  }
  'predictions': {
    "data": {
      "id": string;
      "broadcaster_id": string;
      "broadcaster_name": string;
      "broadcaster_login": string;
      "title": string;
      "winning_outcome_id": string | null;
      "outcomes": {
        "id": string;
        "title": string;
        "users": number;
        "channel_points": number;
        "top_predictors": {
          "user_id": string;
          "user_name": string;
          "user_login": string;
          "channel_points_used": number;
          "channel_points_won": number;
        } | null;
        "color": "BLUE" | "PINK";
      }[];
      "prediction_window": number;
      "status": "ACTIVE" | "CANCELED" | "LOCKED" | "RESOLVED";
      "created_at": string;
      "ended_at": string | null;
      "locked_at": string | null;
    }[];
  }
  'raids': {
    'data': {
      'created_at': string;
      'is_mature': boolean;
    }[];
  }
  'schedule/segment': {
    "data": {
      "segments": {
        "id": string;
        "start_time": string;
        "end_time": string;
        "title": string;
        "canceled_until": string | null;
        "category": {
          "id": string;
          "name": string;
        } | null;
        "is_recurring": boolean;
      }[];
      "broadcaster_id": string;
      "broadcaster_name": string;
      "broadcaster_login": string;
      "vacation": {
        "start_time": string;
        "end_time": string;
      } | null;
    }
  }
  'streams/markers': {
    'data': {
      'id': string;
      'created_at': string;
      'position_seconds': string;
      'description': string;
    }[];
  }
  'whispers': {}
}

export interface Patch {
  'channels': {
    "game_id"?: string;
    "broadcaster_language"?: string;
    "title"?: string;
    "delay"?: number;
    "tags"?: string[];
    "content_classification_labels"?: label[];
    "is_branded_content"?: boolean;
  };
  'channel_points/custom_rewards': {
    "title"?: string;
    "prompt"?: string;
    "cost"?: number;
    "background_color"?: string;
    "is_enabled"?: boolean;
    "is_user_input_required"?: boolean;
    "is_max_per_stream_enabled"?: boolean;
    "max_per_stream"?: number;
    "is_global_cooldown_enabled"?: number;
    "global_cooldown_seconds"?: number;
    "is_paused"?: boolean;
    "should_redemptions_skip_request_queue"?: boolean;
  }
  'channel_points/custom_rewards/redemptions': {
    "status": "CANCELED" | "FULFILLED";
  }
  'chat/settings': {
    "emote_mode"?: boolean;
    "follower_mode"?: boolean;
    "follower_mode_duration"?: number;
    "non_moderator_chat_delay"?: boolean;
    "non_moderator_chat_delay_duration"?: 2 | 4 | 6;
    "slow_mode"?: boolean;
    "slow_mode_wait_time"?: number;
    "subscriber_mode"?: boolean;
    "unique_chat_mode"?: boolean;
  }
  'entitlements/drops': {
    "fulfillment_status": "CLAIMED" | "FULFILLED";
    "entitlement_ids": string[];
  }
  'guest_star/slot': {}
  'guest_star/slot_settings': {}
  'polls': {
    "broadcaster_id": string;
    "id": string;
    "status": "TERMINATED" | "ARCHIVED";
  }
  'predictions': {
    "broadcaster_id": string;
    "id": string;
    "status": "CANCELED" | "LOCKED";
    "winning_outcome_id": undefined;
  } | {
    "broadcaster_id": string;
    "id": string;
    "status": "RESOLVED";
    "winning_outcome_id": string;
  }
  'schedule/settings': {}
  'schedule/segment': {
    "start_time"?: string;
    "duration"?: string;
    "category_id"?: string;
    "title"?: string;
    "is_canceled"?: boolean;
    "timezone"?: string;
  }
}
export interface PatchRes {
  'channels': {};
  'channel_points/custom_rewards': {
    "data": {
      "broadcaster_name": string;
      "broadcaster_login": string;
      "broadcaster_id": string;
      "id": string;
      "image": {
        "url_1x": number;
        "url_2x": number;
        "url_4x": number;
      } | null;
      "background_color": string;
      "is_enabled": boolean;
      "cost": number;
      "title": string;
      "prompt": string;
      "is_user_input_required": boolean;
      "max_per_stream_setting": {
        "is_enabled": boolean;
        "max_per_stream": number;
      },
      "max_per_user_per_stream_setting": {
        "is_enabled": boolean;
        "max_per_user_per_stream": number;
      },
      "global_cooldown_setting": {
        "is_enabled": boolean;
        "global_cooldown_seconds": number;
      },
      "is_paused": boolean;
      "is_in_stock": number;
      "default_image": {
        "url_1x": string;
        "url_2x": string;
        "url_4x": string;
      },
      "should_redemptions_skip_request_queue": boolean;
      "redemptions_redeemed_current_stream": number | null;
      "cooldown_expires_at": string | null;
    }[];
  }
  'channel_points/custom_rewards/redemptions': {
    "data": {
      "broadcaster_id": string;
      "broadcaster_name": string;
      "broadcaster_login": string;
      "id": string;
      "user_id": string;
      "user_name": string;
      "user_login": string;
      "reward": {
        "id": string;
        "title": string;
        "prompt": string;
        "cost": number;
      };
      "user_input": string;
      "status": "CANCELED" | "FULFILLED" | "UNFULFILLED";
      "redeemed_at": string;
    }[];
  }
  'chat/settings': {
    "data": {
      "broadcaster_id": string;
      "emote_mode": boolean;
      "follower_mode": boolean;
      "follower_mode_duration": number | null;
      "non_moderator_chat_delay": boolean;
      "non_moderator_chat_delay_duration": 2 | 4 | 6;
      "slow_mode": boolean;
      "slow_mode_wait_time": number | null;
      "subscriber_mode": boolean;
      "unique_chat_mode": boolean;
    }[]
  }
  'entitlements/drops': {
    "data": {
      "status": "INVALID_ID" | "NOT_FOUND" | "SUCCESS" | "UNAUTHORIZED" | "UPDATE_FAILED";
      "ids": string[];
    }[];
  }
  'guest_star/slot': {}
  'guest_star/slot_settings': {}
  'polls': {
    "data": {
      "id": string;
      "broadcaster_id": string;
      "broadcaster_name": string;
      "broadcaster_login": string;
      "title": string;
      "choices": {
        "id": string;
        "title": string;
        "votes": number;
        "channel_points_votes": number;
        "bits_votes": 0;
      }[];
      "bits_voting_enabled": false;
      "bits_per_vote": 0;
      "channel_points_voting_enabled": boolean;
      "channel_points_per_vote": number;
      "status": "ACTIVE" | "COMPLETED" | "TERMINATED" | "ARCHIVED" | "MODERATED" | "INVALID";
      "duration": number;
      "started_at": string;
      "ended_at": string | null;
    }[];
  }
  'predictions': {
    "data": {
      "id": string;
      "broadcaster_id": string;
      "broadcaster_name": string;
      "broadcaster_login": string;
      "title": string;
      "winning_outcome_id": string | null;
      "outcomes": {
        "id": string;
        "title": string;
        "users": number;
        "channel_points": number;
        "top_predictors": {
          "user_id": string;
          "user_name": string;
          "user_login": string;
          "channel_points_used": number;
          "channel_points_won": number;
        }[];
        "color": "BLUE" | "PINK";
      }[];
      "prediction_window": number;
      "status": "ACTIVE" | "CANCELED" | "LOCKED" | "RESOLVED";
      "created_at": string;
      "ended_at": string | null;
      "locked_at": string | null;
    }[];
  }
  'schedule/settings': {}
  'schedule/segment': {
    "data": {
      "segments": {
        "id": string;
        "start_time": string;
        "end_time": string;
        "title": string;
        "canceled_until": string | null;
        "category": {
          "id": string;
          "name": string;
        } | null;
        "is_recurring": boolean;
      }[];
      "broadcaster_id": string;
      "broadcaster_name": string;
      "broadcaster_login": string;
      "vacation": {
        "start_time": string;
        "end_time": string;
      } | null;
    }
  }
}

export class API extends EventEmitter {
  constructor(
    id: string,
    secret: string,
    customTokens: boolean,
    token: string | null,
    refreshToken: string | null,
  );
  public client_id: string;
  public client_secret: string;
  public refresh_token: string;
  public token: string;
  public headers: headers;
  public valid: boolean;

  public post<K extends keyof Post>(
    url: K,
    headers: header,
    data: Post[K]
  ): Promise<string | PostRes[K]>;
  public patch<K extends keyof Patch>(
    url: K,
    headers: header,
    data: Patch[K],
  ): Promise<string | PatchRes[K]>;
  public get<K extends keyof Get>(url: K, headers: header): Promise<string | Get[K]>;
  public delete<K extends keyof Delete>(url: K, headers: header): Promise<string | Delete[K]>;

  public on(
    event: "result",
    listener: (
      type: "post" | "patch" | "get" | "delete",
      url: string,
      json: object | 'No Content',
    ) => void,
  ): this;
  public on(
    event: "refreshToken",
    listener: (
      token: string,
      refreshToken: string,
    ) => void,
  ): this;
}

// IRC CLIENT TYPINGS

interface OutgoingTags {
  "client-nonce": string;
  "reply-parent-msg-id": string;
}

type ChannelName = `#${string}`;

declare namespace Options {
  export interface Options {
    globalDefaultChannel: string;
    skipMembership: boolean;
    joinInterval: number;
  }
  export interface Connection {
    server: string;
    port: number;
    secure: boolean;
    reconnect: boolean;
    reconnectDecay: number;
    reconnectInterval: number;
    maxReconnectInterval: number;
    maxReconnectAttempts: number;
    timeout: number;
  }
  export interface Identity {
    username: string;
    password: string | Promise<string> | (() => string | Promise<string>);
  }
  export type Channels = string[];
}

interface ClientOptions {
  options?: Partial<Options.Options>;
  connection?: Partial<Options.Connection>;
  identity?: Options.Identity;
  channels?: Options.Channels;
}

interface BadgeInfo {
  subscriber?: string;
  [key: string]: string | undefined;
}

interface Badges {
  broadcaster?: string;
  moderator?: string;
  subscriber?: string;
  staff?: string;
  turbo?: string;
  [key: string]: string | undefined;
}

interface GlobalUserstate {
  "badge-info": BadgeInfo | null;
  badges: Badges | null;
  color: string;
  "display-name": string;
  "emote-sets": string;
  "user-id": string;
  "user-type": "admin" | "global_mod" | "staff" | null;
  "badge-info-raw": string | null;
  "badges-raw": string | null;
}

interface Userstate extends Omit<GlobalUserstate, "user-id"> {
  mod: boolean;
  subscriber: boolean;
  username: string;
}

interface subgiftUserstate extends Userstate {
  "msg-param-recipient-display-name": string;
  "msg-param-recipient-id": string;
  "msg-param-recipient-user-name": string;
  "msg-param-send-count": boolean | string;
}

interface mysterygiftUserstate extends Userstate {
  "msg-param-send-count": boolean | string;
}

interface IRCMessage {}

declare interface subMethod {
  prime: boolean;
  plan: "Prime" | "1000" | "2000" | "3000";
  planName: string;
}

declare interface ircEvents {
  "raw_message": [messageCloned: string, message: IRCMessage];
  "ping": [];
  "pong": [latency: number];
  "connected": [server: string, port: string];
  "resub": [
    channel: string,
    username: string,
    streakMonths: number,
    message: string,
    userstate: Userstate,
    methods: subMethod,
  ];
  "sub": [
    channel: string,
    username: string,
    method: subMethod,
    message: string,
    userstate: Userstate,
  ];
  "subscription": [
    channel: string,
    username: string,
    method: subMethod,
    message: string,
    userstate: Userstate,
  ];
  "subgift": [
    channel: string,
    username: string,
    streakMonths: number,
    recipient: string,
    methods: subMethod,
    userstate: subgiftUserstate,
  ];
  "anonsubgift": [
    channel: string,
    streakMonths: number,
    recipient: string,
    methods: subMethod,
    userstate: subgiftUserstate,
  ];
  "submysterygift": [
    channel: string,
    username: string,
    giftSubCount: number,
    methods: subMethod,
    userstate: mysterygiftUserstate,
  ];
  "primepaidupgrade": [
    channel: string,
    username: string,
    methods: subMethod,
    userstate: Userstate,
  ];
  "giftpaidupgrade": [
    channel: string,
    username: string,
    sender: string,
    userstate: Userstate,
  ];
  "anongiftpaidupgrade": [
    channel: string,
    username: string,
    userstate: Userstate,
  ];
  "announcement": [
    channel: string,
    userstate: Userstate,
    message: string,
    self: boolean,
    color: string,
  ];
  "raided": [
    channel: string,
    username: string,
    viewers: number,
    userstate: Userstate,
  ];
  "usernotice": [
    msgid: string,
    channel: string,
    userstate: Userstate,
    message: string,
  ];
  "unhost": [
    channel: string,
    viewers: number,
  ];
  "hosting": [
    channel: string,
    recipient: string,
    viewers: number,
  ];
  "cheer": [
    channel: string,
    userstate: Userstate,
    message: string,
  ];
  "redeem": [
    channel: string,
    redeemer: string,
    rewardType: string,
    userstate: Userstate,
    message: string,
  ];
  "chat": [
    channel: string,
    userstate: Userstate,
    message: string,
    self: boolean,
  ];
  "chatdeleted": [
    channel: string,
    username: string,
    deletedMessage: string,
    userstate: Userstate,
  ];
}

declare class ircClientBase extends EventEmitter {
  opts: ClientOptions;

  maxReconnectAttempts: Options.Connection["maxReconnectAttempts"];
  maxReconnectInterval: Options.Connection["maxReconnectInterval"];
  reconnect: Options.Connection["reconnect"];
  reconnectDecay: Options.Connection["reconnectDecay"];
  reconnectInterval: Options.Connection["reconnectInterval"];
  reconnecting: boolean;
  reconnections: number;
  reconnectTimer: number;

  currentLatency: number;
  latency: Date;
  pingLoop: ReturnType<typeof setInterval>;
  pingTimeout: ReturnType<typeof setTimeout>;
  secure: Options.Connection["secure"];
  server: Options.Connection["server"];
  port: Options.Connection["port"];

  wasCloseCalled: boolean;
  reason: string;
  ws: WebSocket;

  emotes: string;
  emotesets: {};
  username: string;
  channels: ChannelName[];
  globaluserstate: GlobalUserstate;
  userstate: { [key: ChannelName]: Userstate };
  moderators: { [key: ChannelName]: string[] };

  private lastJoined: ChannelName;

  constructor(options: ClientOptions);
  connect(): Promise<[typeof this.server, typeof this.port]>;
  handleMessage(message: IRCMessage);

  public on<K extends keyof ircEvents>(
    event: K,
    listener: (...args: ircEvents[K]) => Awaitable<void>,
  ): this;
  public once<K extends keyof ircEvents>(
    event: K,
    listener: (...args: ircEvents[K]) => Awaitable<void>,
  ): this;
  public off<K extends keyof ircEvents>(
    event: K,
    listener: (...args: ircEvents[K]) => Awaitable<void>,
  ): this;
}

export class ircClient extends ircClientBase {
  constructor(options: ClientOptions);

  action(
    channel: string,
    message: string,
    tags?: OutgoingTags,
  ): Promise<[channel: ChannelName, message: string]>;

  announce(
    channel: string,
    message: string,
  ): Promise<[channel: ChannelName, message: string]>;

  join(
    channel: string,
  ): Promise<[channel: ChannelName]>;

  reply(
    channel: string,
    message: string,
    replyParentMsgId: string,
  ): Promise<[channel: ChannelName, message: string]>;

  say(
    channel: string,
    message: string,
    tags?: OutgoingTags,
  ): Promise<[channel: ChannelName, message: string]>;
}
