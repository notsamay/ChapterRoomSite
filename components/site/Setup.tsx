import OfficerTools from "./OfficerTools";
import SetupSteps from "./SetupSteps";
import Title from "./Title";

// Both halves are graphics in the social kit's style: real app cards, straight and lifted,
// on a flat emerald panel. Nothing plays in sequence, so the whole thing reads at a glance.

export default function Setup() {
  return (
    <>
      {/* Centred, unlike the pages around it: the headline over three big screens that step down
          and across like a timeline, each with its time. */}
      <section id="how" className="cr-section cr-page cr-g-ivory cr-how">
        <div className="cr-wrap">
          <div className="cr-head cr-how-head" data-reveal>
            <Title text="up and running / in 20 minutes." />
            <p className="cr-sub">Three steps, start to finish.</p>
          </div>
          <SetupSteps />
        </div>
      </section>

      {/* The headline centred on top, six equal cards in two rows underneath. */}
      <section id="more" className="cr-section cr-page cr-g-black cr-on-dark cr-more-page">
        <div className="cr-wrap">
          <OfficerTools>
            <div className="cr-head cr-more-head" data-reveal>
              <Title text="officer tools, / built in." />
              <p className="cr-sub">Once everyone’s in, this is what officers stop doing by hand.</p>
              <p className="cr-ot-hint">Hover over a tile to see it work.</p>
            </div>
          </OfficerTools>
        </div>
      </section>
    </>
  );
}
