import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../Page/CSS/PremiumSimpleHero.css"; // <-- import the separated CSS file

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
  const [dragged, setDragged] = useState(false); // used to detect drag vs click

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setDragged(false);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };
  const handleMouseLeave = () => {
    setIsDragging(false);
  };
  const handleMouseUp = () => {
    setIsDragging(false);
    // small timeout to reset dragged after click handling
    setTimeout(() => setDragged(false), 0);
  };
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1;
    if (Math.abs(walk) > 5) setDragged(true);
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

  const fallbackImage = "/images/placeholder.svg";

  const onCardView = (card: Card) => {
    console.log("Card view:", card.title);
  };

  const onServiceView = (svc: Service) => {
    console.log("Service view:", svc.id);
  };

  const allData = servicesData;
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.max(1, Math.ceil(allData.length / ITEMS_PER_PAGE));
  const paginated = allData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages) return;
    setCurrentPage(p);
    const el = document.querySelector('.all-accounts');
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const slugify = (text?: string) => {
    if (!text) return "";
    return encodeURIComponent(
      text
        .toLowerCase()
        .trim()
        .replace(/['"]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
    );
  };

  return (
    <div className="page-wrap">
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
          {cards.map((card, index) => {
            const to = `/category/${slugify(card.title)}`; // e.g. /category/streaming-combos
            return (
              <Link
                key={index}
                to={to}
                className="campus-card-link"
                style={{ textDecoration: "none", color: "inherit" }}
                role="listitem"
                aria-label={card.title ?? `Card ${index + 1}`}
                onClick={(e) => {
                  // prevent navigation if user was dragging
                  if (dragged || isDragging) {
                    e.preventDefault();
                    return;
                  }
                  onCardView(card);
                }}
              >
                <div className="campus-card" style={cardStyle(card.image)}>
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
                    onClick={(e) => {
                      // keep button click from re-triggering link during dragging
                      if (dragged || isDragging) {
                        e.preventDefault();
                        return;
                      }
                      // allow the Link to navigate — optionally call onCardView
                      e.preventDefault(); // avoid double navigation; use programmatic navigation if needed
                      onCardView(card);
                    }}
                    aria-label={`View ${card.title ?? "item"}`}
                  >
                    View <span style={arrowStyle}>→</span>
                  </button>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ---------- NEW: All Accounts section (includes All-Account Card + paginated cards) ---------- */}
      <section className="all-accounts" aria-label="All Accounts">
        <div className="all-accounts__header">
          <div className="all-accounts__title">All Accounts</div>
          <div style={{ fontSize: 14, color: '#111' }}>{allData.length} results</div>
        </div>

        <div className="all-accounts__grid">
          {/* All-Account summary card */}

          {/* Paginated service cards (HALF IMAGE / HALF CONTENT) */}
          {paginated.map((s) => (
            <Link
              key={s.id}
              to={`/service/${encodeURIComponent(s.id)}`}
              style={{ textDecoration: "none", color: "inherit" }}
              aria-label={s.title}
              onClick={(e) => {
                if (dragged || isDragging) {
                  e.preventDefault();
                  return;
                }
                onServiceView(s);
              }}
            >
              <div className="account-card" role="article">
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
                    onClick={(e) => {
                      // ensure button doesn't cause navigation while dragging
                      if (dragged || isDragging) {
                        e.preventDefault();
                        return;
                      }
                      e.preventDefault(); // if you prefer programmatic navigation, implement here
                      onServiceView(s);
                    }}
                    aria-label={`View ${s.title}`}
                  >
                    View <span style={arrowStyle}>→</span>
                  </button>
                </div>
              </div>
            </Link>
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
