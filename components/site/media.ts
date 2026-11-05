// Real recordings of the app, made in its demo harness on the sample chapter (Acacia Wisconsin).
// Every clip lives in /public/media with a poster frame of the same name.

export type Clip = { src: string; poster: string };

const clip = (name: string): Clip => ({ src: `/media/${name}.mp4`, poster: `/media/${name}-poster.jpg` });

export const CLIPS = {
  tour: clip("tour"),
  chat: clip("chat"),
  cross: clip("cross"),
  albums: clip("albums"),
  checkin: clip("checkin"),
  vouchers: clip("vouchers"),
  poll: clip("poll"),
  feed: clip("feed"),
  secOff: clip("sec-off"),
  secMedium: clip("sec-medium"),
  secMax: clip("sec-max"),
  rules: clip("rules"),
  geo: clip("geo"),
  attend: clip("attend"),
  pay: clip("pay"),
  duesPlan: clip("dues-plan"),
  merch: clip("merch"),
  payouts: clip("payouts"),
  setupStart: clip("setup-start"),
  setupCodes: clip("setup-codes"),
  setupJoin: clip("setup-join"),
  tileAdmin: clip("tile-admin"),
  tileUpcoming: clip("tile-upcoming"),
  tileExcuses: clip("tile-excuses"),
  tilePowers: clip("tile-powers"),
  tileReports: clip("tile-reports"),
  tilePaid: clip("tile-paid"),
} satisfies Record<string, Clip>;

export const STILLS = {
  screenshotLog: "/media/still-screenshot-log.jpg",
  recordingBlur: "/media/still-recording-blur.jpg",
  mentionRush: "/media/mention-rush.jpg",
  appIcon: "/media/app-icon.png",
};
