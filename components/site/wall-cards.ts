// Real crops of the app (the social kit's UI cards), most important first. Width and height are the
// files' own, so nothing shifts as they load. Each card links to the section that shows that feature;
// `tag` is the label it shows on hover.
export type WallCard = { file: string; alt: string; w: number; h: number; tag: string; href: string };

export const WALL_CARDS: WallCard[] = [
  { file: "chat-basketball", alt: "The Intramural Basketball chat", w: 780, h: 700, tag: "Chats", href: "#talk" },
  { file: "albums-grid-dark", alt: "Album covers: Fall Retreat, Chicago Trip, Formal Fittings, Sunrise Hike", w: 780, h: 772, tag: "Albums", href: "#features" },
  { file: "event-card", alt: "Homecoming Tailgate, with Add to calendar and Directions", w: 780, h: 564, tag: "Events", href: "#events" },
  { file: "voucher-hoodie", alt: "The Chapter Hoodie voucher: $45, sizes and quantity", w: 780, h: 640, tag: "Vouchers", href: "#money" },
  { file: "feed-photo-post", alt: "A photo post in the Announcements feed", w: 780, h: 540, tag: "Feeds", href: "#talk" },
  { file: "check-in-button-card", alt: "The Check in button: your location is checked when you tap", w: 780, h: 224, tag: "Check-in", href: "#events" },
  { file: "officer-people", alt: "Officer tools: members, groups, roles and powers, invite codes", w: 780, h: 464, tag: "Officer tools", href: "#more" },
  { file: "cross-org-chat", alt: "A chat with another org on campus", w: 780, h: 608, tag: "Cross-org chats", href: "#talk" },
  { file: "calendar", alt: "The calendar for November", w: 780, h: 640, tag: "Calendar", href: "#more" },
  { file: "security-screenshot-logged", alt: "Screenshot logged: who, when and where", w: 780, h: 320, tag: "Security", href: "#security" },
  { file: "attendance-list", alt: "Attendance: on time, late, excused and missed", w: 780, h: 536, tag: "Attendance", href: "#events" },
  { file: "membership-fee-plan", alt: "A membership fee on a payment plan: 1 of 3 paid", w: 780, h: 388, tag: "Membership fees", href: "#money" },
  { file: "excuse-reasons", alt: "Can't go? Pick a reason", w: 780, h: 440, tag: "Excuses", href: "#more" },
  { file: "invite-code", alt: "An invite code that changes every day", w: 780, h: 404, tag: "Invite codes", href: "#how" },
  { file: "roles-list", alt: "Roles, highest first", w: 780, h: 522, tag: "Roles", href: "#hierarchy" },
  { file: "groups-list", alt: "Groups you're in: Class of 2027 and Exec Board", w: 780, h: 356, tag: "Groups", href: "#hierarchy" },
];
