import "./LocationsPage.scss";
import { Link, NavLink } from 'react-router-dom';

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
    area: "Thornhill",
    address: "7345 Yonge St",
    cityProvince: "Thornhill, Ontario  L3T 2B3",
    phone: "+1 877-781-0727",
    hours: [
      { days: "Mon – Fri", time: "10:00 AM – 9:00 PM" },
      { days: "Saturday",  time: "10:00 AM – 9:00 PM" },
      { days: "Sunday",    time: "10:00 AM – 8:00 PM" },
    ],
    mapsLink: "https://www.google.ca/maps/place/Tavazo+Dried+Nuts+%26+Fruits/@43.7746414,-79.5802445,11z/data=!3m1!5s0x882b2cf71d6fb805:0x75684f82162624d1!4m10!1m2!2m1!1sTavazo+Dried+Nuts+%26+Fruits!3m6!1s0x882b2cf705f5c663:0x33ba4de1dcab1200!8m2!3d43.8065894!4d-79.4217291!15sChpUYXZhem8gRHJpZWQgTnV0cyAmIEZydWl0cyIDiAEBWhwiGnRhdmF6byBkcmllZCBudXRzICYgZnJ1aXRzkgEJbnV0X3N0b3JlmgEkQ2hkRFNVaE5NRzluUzBWSlEwRm5TVU5rTVhOdFl6VjNSUkFC4AEA-gEECDAQSA!16s%2Fg%2F1tftlvfz?entry=ttu&g_ep=EgoyMDI2MDMxNy4wIKXMDSoASAFQAw%3D%3D",
    note: "",
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
      <NavLink to="/Order">
      <div className="btn-primary">
        Place an Order <ArrowRight />
      </div>
      </NavLink>
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
        
        <div class="embed-google-map">
          <iframe width="100%" height="100" frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0" src="https://maps.google.com/maps?q=7345 Yonge St, Thornill, ON L3T 2B3, Canada&t=&zoom=4&maptype=roadmap&ie=UTF8&iwloc=&output=embed">
          </iframe>
          
          </div>
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
