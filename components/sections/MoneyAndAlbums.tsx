import PhoneFrame from "@/components/PhoneFrame";
import Reveal from "@/components/Reveal";
import AlbumScreen from "@/components/screens/AlbumScreen";
import VouchersScreen from "@/components/screens/VouchersScreen";
import { SCREENSHOTS } from "@/components/screenshots";
import { Eyebrow } from "./primitives";

const CARD_H3 = "mb-[18px] text-balance font-head text-[clamp(28px,3.2vw,42px)] font-extrabold leading-none tracking-[-0.04em]";
const CARD_BODY = "mb-7 text-[17px] leading-[1.6] text-cream/70";

export default function MoneyAndAlbums() {
  return (
    <section className="bg-bone text-ink">
      <div className="mx-auto max-w-container px-6 py-[clamp(76px,9vw,120px)]">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] gap-7">
          <Reveal y={30} className="min-w-0">
            <article className="flex h-full flex-col overflow-hidden rounded-[32px] bg-pine px-11 pt-[52px] text-cream">
              <Eyebrow className="text-sage">Vouchers</Eyebrow>
              <h3 className={CARD_H3}>Sell the voucher. The money is the chapter&rsquo;s.</h3>
              <p className={CARD_BODY}>
                Formal tickets, guest passes, bus seats: vouchers go out in the app, members pay in a tap, and the
                money lands in the chapter&rsquo;s own account instead of someone&rsquo;s Venmo. Dues sit right next to
                it, so the treasurer knows who is square and who owes.
              </p>
              <div className="mt-auto flex justify-center">
                <PhoneFrame
                  width={260}
                  height={400}
                  screen="#1B5340"
                  crop="top"
                  boxShadow="0 -10px 60px rgba(0,0,0,0.35)"
                  src={SCREENSHOTS.vouchers}
                  alt="Upcoming vouchers: formal tickets, jerseys and registrations, each with a price and due date"
                >
                  <VouchersScreen />
                </PhoneFrame>
              </div>
            </article>
          </Reveal>

          <Reveal delay={100} y={30} className="min-w-0">
            <article className="flex h-full flex-col overflow-hidden rounded-[32px] bg-navy px-11 pt-[52px] text-cream">
              <Eyebrow className="text-steel">Albums</Eyebrow>
              <h3 className={CARD_H3}>Every formal and tailgate in one place.</h3>
              <p className={CARD_BODY}>
                Photos and videos from the whole chapter, sorted by event instead of buried in someone&rsquo;s camera
                roll. Drop an album straight into a chat when the pictures are worth seeing again.
              </p>
              <div className="mt-auto flex justify-center">
                <PhoneFrame
                  width={260}
                  height={400}
                  screen="#4D2D3B"
                  crop="top"
                  boxShadow="0 -10px 60px rgba(0,0,0,0.35)"
                  src={SCREENSHOTS.album}
                  alt="A shared chapter album of composite photos"
                >
                  <AlbumScreen />
                </PhoneFrame>
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
