import PhoneFrame from "@/components/PhoneFrame";
import Reveal from "@/components/Reveal";
import { SCREENSHOTS } from "@/components/screenshots";
import { Eyebrow, H2_WIDE } from "./primitives";

const cards = [
  {
    key: "events",
    eyebrow: "Events",
    eyebrowTone: "text-steel",
    bg: "bg-ink",
    screen: "#141C17",
    src: SCREENSHOTS.register,
    alt: "The Register tab: the next event up, with upcoming events and vouchers below it",
    title: "Every event, with RSVPs and reminders.",
    body: "RSVP from the card in the chat. Reminders go out an hour before. Mandatory events land on the attendance record.",
  },
  {
    key: "vouchers",
    eyebrow: "Vouchers",
    eyebrowTone: "text-sage",
    bg: "bg-pine",
    screen: "#1B5340",
    src: SCREENSHOTS.vouchers,
    alt: "Buying a voucher: the philanthropy 5K registration sheet with shirt size, the total including fees, and a Buy voucher button",
    title: "Dues, fees and fines that collect themselves.",
    body: "Post a $600 dues voucher or a $40 formal fee with a deadline. Members pay in-app, the money lands in the chapter's own account through Stripe, and one screen shows who's paid, on a plan, or owes.",
  },
  {
    key: "albums",
    eyebrow: "Albums",
    eyebrowTone: "text-brick-light",
    bg: "bg-plum",
    screen: "#4D2D3B",
    src: SCREENSHOTS.album,
    alt: "The PNMs album from rush, with thumbs-up and thumbs-down vote counts on each cookout photo",
    title: "Photos that don't disappear.",
    body: "Shared albums by event, dropped into any chat or feed as a card. Members only, and a copied link is dead outside the app.",
  },
];

const campusSteps = [
  { n: "1", title: "Invite", body: "An officer starts a chat and invites other fraternities or sororities at your school." },
  { n: "2", title: "Accept", body: "Their exec gets an invite card and accepts or declines." },
  { n: "3", title: "Pick your people", body: "Each chapter chooses which of its own members join, so you bring the social chairs and not the whole house." },
];

const CARD_TITLE = "mb-[14px] text-balance font-head text-[clamp(24px,2.4vw,32px)] font-extrabold leading-[1.05] tracking-[-0.035em]";
const CARD_BODY = "mb-6 text-[15.5px] leading-[1.6] text-cream/70";

export default function Features() {
  return (
    <section id="features" className="overflow-hidden bg-bone text-ink">
      <div className="mx-auto max-w-container px-6 py-[clamp(76px,9vw,120px)]">
        <Reveal from="blur" className="mb-[clamp(44px,5vw,64px)] max-w-[900px]">
          <Eyebrow className="text-moss">Essentials</Eyebrow>
          <h2 className={H2_WIDE}>Everything else a chapter runs on.</h2>
        </Reveal>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-5">
          {cards.map((card, i) => (
            <Reveal key={card.key} delay={60 + i * 90} y={30} from="scale" className="min-w-0">
              <article className={`flex h-full flex-col overflow-hidden rounded-[32px] px-8 pt-10 text-cream ${card.bg}`}>
                <Eyebrow className={card.eyebrowTone}>{card.eyebrow}</Eyebrow>
                <h3 className={CARD_TITLE}>{card.title}</h3>
                <p className={CARD_BODY}>{card.body}</p>
                <div className="mt-auto flex justify-center">
                  <PhoneFrame
                    width={260}
                    height={400}
                    screen={card.screen}
                    crop="top"
                    boxShadow="0 -10px 60px rgba(0,0,0,0.35)"
                    src={card.src}
                    alt={card.alt}
                  />
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Chats that cross chapters: one green card. Copy up top, the invite flow as three columns below. */}
        <Reveal y={30} from="scale" className="mt-5">
          <div
            className="rounded-[32px] bg-pine px-[clamp(28px,4vw,56px)] py-[clamp(40px,5vw,60px)] text-cream"
            style={{ boxShadow: "0 30px 70px rgba(11,18,14,0.14)" }}
          >
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] items-end gap-x-16 gap-y-6">
              <div className="min-w-0">
                <Eyebrow className="text-sage">Across campus</Eyebrow>
                <h3 className="font-head text-[clamp(28px,3.4vw,42px)] font-extrabold leading-[1.05] tracking-[-0.035em]">
                  Chats with other chapters on your campus.
                </h3>
              </div>
              <p className="max-w-[520px] text-[16.5px] leading-[1.6] text-cream/70">
                Mixers, philanthropy partnerships, Greek Week and IFC coordination, in one chat that both chapters
                moderate. Messages show the sender&rsquo;s name and chapter. If a chapter pulls out, its members leave
                with it.
              </p>
            </div>

            <ol className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-x-10 gap-y-8 border-t border-cream/10 pt-8">
              {campusSteps.map((step, i) => (
                <li key={step.n}>
                  <div className="flex items-center gap-1.5" aria-label={`Step ${i + 1} of 3`}>
                    {[0, 1, 2].map((seg) => (
                      <span key={seg} className={`h-1 w-6 rounded-full ${seg <= i ? "bg-sage" : "bg-cream/10"}`} />
                    ))}
                  </div>
                  <div className="mt-5 font-head text-[22px] font-extrabold leading-tight tracking-[-0.02em]">{step.title}</div>
                  <p className="mt-2 max-w-[300px] text-[15px] leading-[1.55] text-cream/65">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
