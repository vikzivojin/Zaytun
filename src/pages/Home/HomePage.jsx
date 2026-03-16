import "./HomePage.scss";


// ── Image imports ─────────────────────────────────────────
// Replace these paths with your actual asset paths
import heroImg      from "../../assets/images/zaytun-hero.jpeg";
import plateImg     from "../../assets/images/zaytun-plate.jpeg";
import holdImg      from "../../assets/images/zaytun-hold.jpeg";
import sandwichImg  from "../../assets/images/zaytun-sandwich.jpeg";
import logoImg      from "../../assets/images/zaytun-logo.png";

// Marquee text repeated for seamless loop
const MARQUEE_ITEMS = [
  
];

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function HomePage() {
  const marqueeItems = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]; // duplicate for seamless loop

  return (
    <div className="home-page">

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero__image-side">
          <img src={heroImg} alt="Zaytun marinated olives served in a bowl" />
        </div>

        <div className="hero__content">
          <div className="hero__eyebrow">
            <span>Toronto's Finest</span>
          </div>

          <h1 className="hero__title">
            Olives <em>reimagined</em>
          </h1>

          <p className="hero__desc">
            Zaytün is a small-batch marinated olive spread, crafted with pomegranate, walnut, and fresh herbs. A taste of the Mediterranean, made in Toronto.
          </p>

          <div className="hero__cta">
            <a href="/order" className="btn-primary">
              Order Now <ArrowRight />
            </a>
            <a href="#story" className="btn-ghost">Our Story</a>
          </div>
        </div>
      </section>

      {/* ── Marquee ── */}
      <div className="marquee-strip" aria-hidden="true">
        <div className="marquee-track">
          {marqueeItems.map((item, i) => (
            <span className="marquee-item" key={i}>{item}</span>
          ))}
        </div>
      </div>

      {/* ── Story ── */}
      <section className="story" id="story">
        <div className="story__text">
          <span className="section-label">Our Story</span>

          <h2 className="story__title">
            Born from a love of <em>olive tradition</em>
          </h2>

          <p className="story__body">
            Every jar of Zaytün begins with carefully selected green olives, slow-marinated in a blend of pomegranate molasses, toasted walnuts, fresh mint, and extra-virgin olive oil. It's a recipe rooted in Middle Eastern tradition — brought to life in small batches right here in Toronto.
          </p>

          <p className="story__body">
            No preservatives. No shortcuts. Just real ingredients and real care, ready to elevate your table.
          </p>

          <div className="story__stats">
            <div className="stat">
              <div className="stat__number">100%</div>
              <div className="stat__label">Natural</div>
            </div>
            <div className="stat">
              <div className="stat__number">3</div>
              <div className="stat__label">Pickup Locations</div>
            </div>
            <div className="stat">
              <div className="stat__number">2</div>
              <div className="stat__label">Sizes Available</div>
            </div>
          </div>
        </div>

        
      </section>

      {/* ── Feature Cards ── */}
      <section className="feature">
        <div className="feature__inner">
          <div className="feature__header">
            <span className="section-label" style={{ justifyContent: "center" }}>How to Enjoy</span>
            <h2 className="feature__title">
              Endlessly <em>versatile</em>
            </h2>
            <p className="feature__subtitle">
              From charcuterie boards to sandwiches, Zaytün transforms any dish into something unforgettable.
            </p>
          </div>

          <div className="feature__grid">
            <div className="feature-card">
              <img src={plateImg} alt="Zaytun served on a plate" />
              <div className="feature-card__overlay">
                <div className="feature-card__tag">Serve</div>
                <div className="feature-card__title">On the <em>table</em></div>
                <div className="feature-card__desc">
                  Spoon generously onto a sharing plate and let guests discover it for themselves.
                </div>
              </div>
            </div>

            <div className="feature-card">
              <img src={holdImg} alt="Zaytun on a crostini" />
              <div className="feature-card__overlay">
                <div className="feature-card__tag">Snack</div>
                <div className="feature-card__title">On <em>crostini</em></div>
                <div className="feature-card__desc">
                  The perfect bite — toasted bread, a leaf of fresh basil, and a generous scoop of Zaytün.
                </div>
              </div>
            </div>

            <div className="feature-card">
              <img src={sandwichImg} alt="Zaytun in a sandwich" />
              <div className="feature-card__overlay">
                <div className="feature-card__tag">Build</div>
                <div className="feature-card__title">In a <em>sandwich</em></div>
                <div className="feature-card__desc">
                  Layer with arugula and fresh goat cheese on ciabatta for a lunch you won't forget.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Order CTA ── */}
      <section className="order-cta">
        <div className="order-cta__label">Ready to Order</div>

        <h2 className="order-cta__title">
          Pick up a jar.
          <em>Change your table.</em>
        </h2>

        <p className="order-cta__text">
          Available for pickup in Downtown Toronto, Etobicoke, and North York. Order ahead and we'll have your Zaytün ready.
        </p>

        <div className="order-cta__prices">
          <div className="price-pill">
            <div className="price-pill__weight">200g</div>
            <div className="price-pill__price">$11</div>
          </div>
          <div className="price-pill">
            <div className="price-pill__weight">800g</div>
            <div className="price-pill__price">$40</div>
          </div>
        </div>

        <a href="/order" className="btn-primary">
          Place an Order <ArrowRight />
        </a>
      </section>

      

    </div>
  );
}
