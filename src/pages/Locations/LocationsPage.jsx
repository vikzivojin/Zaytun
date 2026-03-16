import "./LocationsPage.scss";

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5C5.515 1.5 3.5 3.515 3.5 6c0 3.75 4.5 8.5 4.5 8.5S12.5 9.75 12.5 6c0-2.485-2.015-4.5-4.5-4.5Zm0 6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z" fill="currentColor" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M7 4v3.5l2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// LOCATION DATA — add new entries here to expand the page
// ─────────────────────────────────────────────────────────────
const STORE_LOCATIONS = [
  {
    id: "tavazo-thornhill",
    name: "Tavazo",
    area: "Thornhill / Richmond Hill",
    address: "10309 Yonge St",
    cityProvince: "Richmond Hill, Ontario  L4C 3B9",
    phone: "+1 877-781-0727",
    hours: [
      { days: "Mon – Fri", time: "10:30 AM – 8:30 PM" },
      { days: "Saturday",  time: "10:30 AM – 8:00 PM" },
      { days: "Sunday",    time: "10:30 AM – 8:30 PM" },
    ],
    mapEmbedUrl:
      "https://www.google.com/maps/embed/v1/place?key=AIzaSyDCndO1y0-GIG0i5Bf2TZ9NNaEfzWyvJ1U&q=Tavazo+Dried+Nuts+%26+Fruits,+10309+Yonge+St,+Richmond+Hill,+ON",
    mapsLink: "https://maps.google.com/?q=10309+Yonge+St+Richmond+Hill+Ontario",
    note: "Look for Zaytün in the XXXX section near the front of the store.",
  },
];

// ─────────────────────────────────────────────────────────────
// ONLINE ORDERING CARD (separate from physical locations)
// ─────────────────────────────────────────────────────────────
function OnlineCard() {
  return (
    <div className="online-card">
      <div className="online-card__eyebrow">
        <span className="section-label">Available Now</span>
      </div>
      <h2 className="online-card__title">
        Order online for <em>pickup</em>
      </h2>
      <p className="online-card__body">
        Place your order ahead of time and choose a pickup location in Downtown Toronto, Etobicoke, or North York. We'll have your Zaytün ready and waiting.
      </p>
      <div className="online-card__prices">
        <div className="price-pill">
          <div className="price-pill__weight">200g</div>
          <div className="price-pill__price">$11</div>
        </div>
        <div className="price-pill">
          <div className="price-pill__weight">800g</div>
          <div className="price-pill__price">$40</div>
        </div>
      </div>
      <a href="/Order" className="btn-primary">
        Place an Order <ArrowRight />
      </a>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// STORE LOCATION CARD
// ─────────────────────────────────────────────────────────────
function StoreCard({ location }) {
  return (
    <div className="store-card" id={location.id}>
      <div className="store-card__info">
        <span className="section-label">In Store</span>

        <h2 className="store-card__name">{location.name}</h2>
        <p className="store-card__area">{location.area}</p>

        <div className="store-card__address">
          <PinIcon />
          <div>
            <div>{location.address}</div>
            <div>{location.cityProvince}</div>
          </div>
        </div>

        {location.note && (
          <p className="store-card__note">{location.note}</p>
        )}

        <div className="store-card__hours">
          <div className="store-card__hours-label">
            <ClockIcon /> Hours
          </div>
          <ul className="hours-list">
            {location.hours.map((h) => (
              <li key={h.days} className="hours-row">
                <span className="hours-row__days">{h.days}</span>
                <span className="hours-row__time">{h.time}</span>
              </li>
            ))}
          </ul>
        </div>

        <a
          href={location.mapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          Get Directions <ArrowRight />
        </a>
      </div>

      <div className="store-card__map">
        <iframe
          title={`Map for ${location.name}`}
          src={location.mapEmbedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────
export default function LocationsPage() {

  function componentDidMount() {
        window.scrollTo(0, 0);
    };

  componentDidMount();
  
  return (
    <div className="locations-page">
      
      {/* Hero */}
      <section className="locations-hero">
        <div className="locations-hero__inner">
          <span className="section-label">Find Zaytün</span>
          <h1 className="locations-hero__title">
            Where to <em>find us</em>
          </h1>
          <p className="locations-hero__desc">
            Order directly from us online, or pick up a jar from one of our retail partners. More locations coming soon.
          </p>
        </div>
        <div className="locations-hero__rule" aria-hidden="true" />
      </section>

      {/* Online ordering */}
      <section className="locations-section">
        <OnlineCard />
      </section>

      {/* Divider */}
      <div className="section-divider" aria-hidden="true">
        <span>✦ In-Store Locations ✦</span>
      </div>

      {/* Store locations — map over STORE_LOCATIONS to add more */}
      <section className="locations-section locations-section--stores">
        {STORE_LOCATIONS.map((loc) => (
          <StoreCard key={loc.id} location={loc} />
        ))}
      </section>

    </div>
  );
}
