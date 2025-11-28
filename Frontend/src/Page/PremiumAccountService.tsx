import React, { useEffect, useRef, useState } from "react";

type Service = {
  id: string;
  title: string;
  originalPrice: number;
  discountPrice?: number;
  discount?: string;
  rating?: number;
  image: string;
  status: "available" | "out-of-stock" | "best-value" | "trending";
};

const servicesData: Service[] = [
  { id: "netflix-4k", title: "Netflix Premium 4K UHD", originalPrice: 2590, discountPrice: 1490, image: "https://shopallpremium.com/wp-content/uploads/2022/02/netflix.jpg.webp", status: "available" },
  { id: "amazon-prime-video", title: "Amazon Prime Video", originalPrice: 1050, discountPrice: 260, image: "https://shopallpremium.com/wp-content/uploads/2022/02/primevideo.png.webp", status: "trending" },
  { id: "spotify-premium", title: "Spotify Premium", originalPrice: 999, discountPrice: 269, image: "https://shopallpremium.com/wp-content/uploads/2022/02/45cc6c91692a3665d97b570a3272132a.jpg", status: "out-of-stock" },
  { id: "youtube-premium-in", title: "YouTube Premium (India)", originalPrice: 1738, discountPrice: 878, image: "https://shopallpremium.com/wp-content/uploads/2022/02/YouTube-Premium-512x512-1.png.webp", status: "available" },
  { id: "altbalaji-premium", title: "ALTBalaji Premium", originalPrice: 1758, discountPrice: 760, image: "https://shopallpremium.com/wp-content/uploads/2022/02/altbalaji.png.webp", status: "available" },
  { id: "hma-vpn", title: "HMA VPN", originalPrice: 1999, discountPrice: 1249, image: "https://shopallpremium.com/wp-content/uploads/2022/02/unnamed-33.png", status: "available" },
];

const heroSlides = [
  "https://shopallpremium.com/wp-content/uploads/2022/02/netflix.jpg.webp",
  "https://shopallpremium.com/wp-content/uploads/2022/02/primevideo.png.webp",
  "https://shopallpremium.com/wp-content/uploads/2022/02/45cc6c91692a3665d97b570a3272132a.jpg",
];

// Proper Sri Lankan Rupee format (LKR 1,490.00)
const formatPrice = (price: number) =>
  `LKR ${price.toLocaleString("en-LK", { minimumFractionDigits: 2 })}`;

interface Card {
  image: string;      // background image (large)
  original?: string;  // original service image (thumbnail, optional)
  title?: string;
  desc?: string;
}

const cards: Card[] = [
  {
    image: "https://via.placeholder.com/497x225.png?text=digital-keys",
    original: servicesData.find(s => s.id === "altbalaji-premium")?.image,
    title: "Digital Keys",
    desc: "License keys & top-ups"
  },
  {
    image: "https://via.placeholder.com/497x225.png?text=games",
    original: servicesData.find(s => s.id === "spotify-premium")?.image,
    title: "Games",
    desc: "Top game codes & bundles"
  },
  {
    image: "https://via.placeholder.com/497x225.png?text=ott",
    original: servicesData.find(s => s.id === "netflix-4k")?.image,
    title: "OTT",
    desc: "Streaming services"
  },
  {
    image: "https://via.placeholder.com/497x225.png?text=premium",
    original: servicesData.find(s => s.id === "youtube-premium-in")?.image,
    title: "Premium",
    desc: "Premium plans & upgrades"
  },
  {
    image: "https://via.placeholder.com/497x225.png?text=streaming-combos",
    original: servicesData.find(s => s.id === "amazon-prime-video")?.image,
    title: "Streaming Combos",
    desc: "Combo subscriptions"
  },
  {
    image: "https://via.placeholder.com/497x225.png?text=utilities",
    original: undefined,
    title: "Utilities",
    desc: "Useful tools & apps"
  },
  {
    image: "https://via.placeholder.com/497x225.png?text=vpn",
    original: servicesData.find(s => s.id === "hma-vpn")?.image,
    title: "VPN",
    desc: "Secure VPN plans"
  },
];

export default function PremiumSimpleHero() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    // Changed from 4000 => 10000 (10 seconds)
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroSlides.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // ---------- Campus slider refs, state & handlers ----------
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };
  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  // ---------- Styles for campus slider and heading ----------
  const containerStyle: React.CSSProperties = {
    padding: "60px 8% 0 8%",
  };

  const sliderWrapperStyle: React.CSSProperties = {
    overflowX: "auto",
    display: "flex",
    gap: "clamp(12px, 2vw, 28px)",
    scrollBehavior: "smooth",
    cursor: isDragging ? "grabbing" : "grab",
    userSelect: "none",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    paddingBottom: 0,
  };

  // ---------- UNIFORM CARD SIZE (fixed) ----------
  const CARD_WIDTH = 260; // px
  const CARD_HEIGHT = 150; // px

  const cardStyle = (image: string): React.CSSProperties => ({
    flex: `0 0 ${CARD_WIDTH}px`,
    width: `${CARD_WIDTH}px`,
    height: `${CARD_HEIGHT}px`,
    backgroundImage: `url(${image})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    borderRadius: "12px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    boxShadow: "0 6px 18px rgba(0,0,0,0.10)",
    transition: "transform 0.28s ease, box-shadow 0.28s ease",
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#F1F5F9", // fallback background requested
  });

  const buttonStyle: React.CSSProperties = {
    position: "absolute",
    bottom: "12px",
    left: "12px",
    padding: "7px 14px",
    backgroundColor: "#ffffff",
    color: "rgb(0, 0, 0)", // black text
    border: "none",
    borderRadius: "40px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "background 0.25s, color 0.25s",
  };

  // VIEW button style for All-Accounts (positioned inside bottom-right of meta)
  const acctButtonStyle: React.CSSProperties = {
    position: "absolute",
    bottom: "12px",
    right: "12px",
    padding: "7px 12px",
    backgroundColor: "#ffffff",
    color: "rgb(0,0,0)",
    border: "none",
    borderRadius: "32px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "13px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const arrowStyle: React.CSSProperties = {
    fontSize: "16px",
    display: "inline-block",
    transition: "transform 0.25s",
  };

  const originalThumbStyle: React.CSSProperties = {
    position: "absolute",
    bottom: "12px",
    right: "12px",
    width: "56px",
    height: "56px",
    borderRadius: "8px",
    overflow: "hidden",
    border: "2px solid rgba(0,0,0,0.08)",
    background: "#fff",
    zIndex: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const css = `
    :root {
      --layout-max-width: 1400px; /* LG container size */
      --card-bg: #F1F5F9; /* requested background for data cards */
    }

    body, .page-wrap {
      font-family: "Montserrat", sans-serif !important;
      color: #000 !important; /* force black text */
    }

    .page-wrap {
      padding: 48px 5%;
      background: #ffffff;
      min-height: 100vh;
      color: #000;
    }

    .layout {
      max-width: var(--layout-max-width);
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 360px; /* wider sidebar for LG */
      gap: 28px;
    }

    .hero-slider {
      position: relative;
      height: 620px; /* slightly larger for LG */
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 8px 26px rgba(0,0,0,0.15);
      background: var(--card-bg);
    }

    .slide {
      position: absolute;
      inset: 0;
      background-size: cover;
      background-position: center;
      opacity: 0;
      transition: opacity 1s ease-in-out;
    }
    .slide.active {
      opacity: 1;
    }

    .hero-slider::after {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, rgba(255,255,255,0.05), rgba(255,255,255,0.10));
      z-index: 5;
    }

    .hero-content {
      position: absolute;
      bottom: 20px;
      left: 20px;
      z-index: 20;
      color: #000;
      text-shadow: none;
      background: rgba(255,255,255,0.92);
      padding: 12px 16px;
      border-radius: 8px;
      box-shadow: 0 6px 20px rgba(0,0,0,0.06);
    }

    .hero-content h3 {
      margin: 0;
      font-size: 2rem;
      font-weight: 800;
      color: #000;
    }
    .hero-content p {
      margin-top: 6px;
      font-weight: 500;
      font-size: 1.05rem;
      color: #000;
    }

    .dots {
      position: absolute;
      bottom: 12px;
      right: 20px;
      display: flex;
      gap: 8px;
      z-index: 30;
    }
    .dot {
      width: 10px;
      height: 10px;
      background: #00000044;
      border-radius: 50%;
      cursor: pointer;
      border: none;
    }
    .dot.active {
      background: #000;
    }

    .sidebar {
      background: var(--card-bg); /* servicesData card bg requested */
      border-radius: 12px;
      padding: 18px;
      border: 1px solid #e6e6e6;
      color: #000;
      box-shadow: 0 6px 20px rgba(0,0,0,0.06);
    }

    .sidebar h3 {
      margin: 0 0 12px;
      font-size: 1.05rem;
      font-weight: 800;
      color: #000;
    }

    .discount-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .discount-item {
      display: flex;
      gap: 12px;
      align-items: center;
      background: #ffffffb8;
      padding: 8px;
      border-radius: 8px;
    }

    .discount-thumb {
      width: 64px;
      height: 64px;
      border-radius: 8px;
      overflow: hidden;
      background: var(--card-bg); /* thumbnail background */
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #eee;
    }

    .discount-thumb img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .discount-meta .name {
      font-weight: 400;
      font-size: 0.92rem;
      color: #000;
    }

    .discount-meta .price {
      font-weight: 400; /* normal weight for price */
      color: #000;
      margin-top: 2px;
    }

    .card-title {
      position: absolute;
      left: 12px;
      top: 12px;
      padding: 6px 10px;
      background: rgba(255,255,255,0.92);
      color: #000;
      font-weight: 700;
      font-size: 0.9rem;
      border-radius: 999px;
      z-index: 12;
      text-transform: none;
      white-space: nowrap;
    }

    .card-desc {
      position: absolute;
      left: 12px;
      bottom: 46px;
      right: 12px;
      font-size: 0.82rem;
      color: #111;
      text-shadow: none;
      z-index: 11;
      line-height: 1.1;
      max-height: 3em;
      overflow: hidden;
      background: rgba(255,255,255,0.80);
      padding: 6px 8px;
      border-radius: 8px;
    }

    /* ALL ACCOUNTS grid */
    .all-accounts {
      margin: 36px auto 80px;
      max-width: var(--layout-max-width);
    }
    .all-accounts__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      gap: 12px;
    }
    .all-accounts__title { font-size: 1.25rem; font-weight: 800; color: #000; }

    /* Changed to 5 columns for desktop */
    .all-accounts__grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 18px;
    }

    /* UPDATED: HALF-IMAGE + HALF-CONTENT styles for .account-card */
    .account-card {
      height: 300px;
      border-radius: 12px;
      overflow: hidden;
      position: relative;
      background: #fff;
      display: flex;
      flex-direction: column;
      box-shadow: 0 8px 22px rgba(0,0,0,0.06);
    }

    /* TOP HALF IMAGE */
    .account-card__img {
      height: 50%;
      width: 100%;
      background-size: cover;
      background-position: center;
    }

    /* BOTTOM HALF CONTENT */
    .account-card__meta {
      height: 50%;
      padding: 12px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      background: #fff;
      z-index: 10;
      position: relative; /* so the button absolute positions inside meta */
    }

    /* Non-bold, smaller text as requested */
    .account-card__meta h4 {
      margin: 0;
      font-size: 1rem; /* slightly smaller */
      font-weight: 400; /* normal weight (not bold) */
      color: #000;
    }

    .account-card__meta p {
      margin-top: 6px;
      font-size: 0.92rem; /* slightly smaller */
      font-weight: 400; /* normal weight */
      color: #333;
    }

    /* Remove old dark overlay if present */
    .account-card::after {
      display: none !important;
    }

    /* Remove zoom hover */
    .account-card:hover {
      transform: none !important;
      background-size: cover !important;
      box-shadow: 0 8px 22px rgba(0,0,0,0.06) !important;
    }

    .all-accounts__pagination {
      display:flex; gap:8px; justify-content:center; margin-top:18px; align-items:center;
    }
    .page-btn {
      border: 1px solid #e6e6e6; background: #fff; padding: 8px 12px; border-radius: 8px; cursor:pointer; font-weight:600;
    }
    .page-btn[aria-current="true"] { background: #000; color: #fff; border-color: #000; }

    @media (max-width:1024px){ .all-accounts__grid { grid-template-columns: repeat(2, 1fr); } .layout { grid-template-columns: 1fr; } }
    @media (max-width:560px){ .all-accounts__grid { grid-template-columns: 1fr; } .hero-slider { height: 300px; } }
  `;

  const fallbackImage = "/images/placeholder.svg";

  const onCardView = (card: Card) => {
    alert(`View: ${card.title ?? "item"}`);
  };

  // New handler for service items (All Accounts)
  const onServiceView = (svc: Service) => {
    alert(`View: ${svc.title}`);
  };

  // ------------------ NEW: All Accounts (cards + pagination) ------------------
  // Data source for "All Accounts" — using servicesData here
  const allData = servicesData;
  const [currentPage, setCurrentPage] = useState(1);

  // Changed from 5 => 10 items per page
  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.max(1, Math.ceil(allData.length / ITEMS_PER_PAGE));
  const paginated = allData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages) return;
    setCurrentPage(p);
    // scroll into view the all-accounts section for better UX
    const el = document.querySelector('.all-accounts');
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Highlight special "All-Account Card" (a summary card at the start)
  const AllAccountSummaryCard = () => (
    <div
      className="account-card"
      role="article"
      aria-label="All accounts summary"
      style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.04), rgba(0,0,0,0.06)), url('https://via.placeholder.com/900x400.png?text=All+Accounts')`, backgroundSize: 'cover', backgroundPosition: 'center', color: '#000' }}
    >
      <div className="account-card__meta">
        <h4>All Accounts</h4>
        <p>{allData.length} total plans — view & manage all subscriptions</p>
      </div>
      <button
        style={{ position: 'absolute', right: 12, top: 12, background: '#fff', border: 'none', padding: '8px 12px', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}
        onClick={() => goToPage(1)}
        aria-label="View all accounts"
      >
        View All
      </button>
    </div>
  );

  return (
    <div className="page-wrap">
      <style>{css}</style>

      <div className="layout">
        {/* HERO IMAGE SLIDER */}
        <div className="hero-slider" role="region" aria-label="Main hero slider">
          {heroSlides.map((img, i) => (
            <div
              key={i}
              className={`slide ${i === activeIndex ? "active" : ""}`}
              style={{ backgroundImage: `url(${img})` }}
              aria-hidden={i !== activeIndex}
            />
          ))}

          <div className="hero-content">
            <h3>Streaming & Premium Deals</h3>
            <p>Sri Lanka’s best daily offers — save more today!</p>
          </div>

          <div className="dots" role="tablist" aria-label="Hero slides">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                className={`dot ${activeIndex === i ? "active" : ""}`}
                onClick={() => setActiveIndex(i)}
                aria-pressed={activeIndex === i}
                title={`Show slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* SIDEBAR */}
        <aside className="sidebar" aria-label="Discounted services">
          <h3>Discounted</h3>
          <div className="discount-list">
            {servicesData.map((s) => (
              <div key={s.id} className="discount-item">
                <div className="discount-thumb" aria-hidden>
                  <img
                    src={s.image}
                    alt={s.title}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = fallbackImage;
                    }}
                  />
                </div>
                <div className="discount-meta">
                  <div className="name">{s.title}</div>
                  <div className="price">{formatPrice(s.discountPrice ?? s.originalPrice)}</div>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* ---------- Category slider (full-width) ---------- */}
      <div style={containerStyle}>
        <div
          ref={containerRef}
          style={sliderWrapperStyle}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className="hide-scrollbar"
          role="list"
          aria-label="Category slider"
        >
          {cards.map((card, index) => (
            <div
              key={index}
              className="campus-card"
              style={cardStyle(card.image)}
              role="listitem"
              aria-label={card.title ?? `Card ${index + 1}`}
            >
              {card.title && <div className="card-title">{card.title}</div>}
              {card.desc && <div className="card-desc">{card.desc}</div>}
              {card.original && (
                <div style={originalThumbStyle} aria-hidden>
                  <img
                    src={card.original}
                    alt={`${card.title ?? "item"} original"`}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = fallbackImage;
                    }}
                  />
                </div>
              )}

              <button
                style={buttonStyle}
                onClick={() => onCardView(card)}
                aria-label={`View ${card.title ?? "item"}`}
              >
                View <span style={arrowStyle}>→</span>
              </button>
            </div>
          ))}
        </div>

        <style>{`
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .fancy-heading::after {
            content: "";
            display: block;
            width: 80px;
            height: 4px;
            margin: 12px auto 0;
            background: linear-gradient(90deg, #000, #000);
            border-radius: 2px;
            animation: fadeInLine 1s ease forwards;
          }
          @keyframes fadeInLine { from { width: 0; opacity: 0; } to { width: 80px; opacity: 1; } }

          @media (max-width: 480px) { .campus-card { flex: 0 0 90% !important; width: calc(100% - 40px) !important; } }
          @media (min-width: 481px) and (max-width: 1024px) { .campus-card { flex: 0 0 calc(50% - 12px) !important; width: calc(50% - 12px) !important; } }
          @media (min-width: 1025px) { .campus-card { flex: 0 0 ${CARD_WIDTH}px !important; width: ${CARD_WIDTH}px !important; } }

          @media (hover: hover) {
            .campus-card:hover { transform: scale(1.035); box-shadow: 0 12px 26px rgba(0,0,0,0.14); }
            .campus-card button:hover { background-color: #000; color: #fff; }
            .campus-card button:hover span { transform: translateX(4px); }
          }
        `}</style>
      </div>

      {/* ---------- NEW: All Accounts section (includes All-Account Card + paginated cards) ---------- */}
      <section className="all-accounts" aria-label="All Accounts">
        <div className="all-accounts__header">
          <div className="all-accounts__title">All Accounts</div>
          <div style={{ fontSize: 14, color: '#111' }}>{allData.length} results</div>
        </div>

        <div className="all-accounts__grid">
          {/* All-Account summary card */}
          <AllAccountSummaryCard />

          {/* Paginated service cards (HALF IMAGE / HALF CONTENT) */}
          {paginated.map((s) => (
            <div
              key={s.id}
              className="account-card"
              role="article"
              aria-label={s.title}
            >
              {/* TOP HALF IMAGE */}
              <div
                className="account-card__img"
                style={{ backgroundImage: `url(${s.image})` }}
              />

              {/* BOTTOM HALF CONTENT */}
              <div className="account-card__meta">
                <h4>{s.title}</h4>
                <p>{formatPrice(s.discountPrice ?? s.originalPrice)}</p>

                {/* VIEW button inside meta (bottom-right) */}
                <button
                  style={acctButtonStyle}
                  onClick={() => onServiceView(s)}
                  aria-label={`View ${s.title}`}
                >
                  View <span style={arrowStyle}>→</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="all-accounts__pagination" role="navigation" aria-label="All accounts pagination">
          <button className="page-btn" onClick={() => goToPage(currentPage - 1)} aria-disabled={currentPage === 1} aria-label="Previous page">Prev</button>

          {/* render page numbers (compact) */}
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              className="page-btn"
              onClick={() => goToPage(i + 1)}
              aria-current={currentPage === i + 1}
              aria-label={`Go to page ${i + 1}`}
            >
              {i + 1}
            </button>
          ))}

          <button className="page-btn" onClick={() => goToPage(currentPage + 1)} aria-disabled={currentPage === totalPages} aria-label="Next page">Next</button>
        </div>
      </section>

    </div>
  );
}
