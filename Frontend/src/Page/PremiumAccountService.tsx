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
  image: string;
  title?: string;
  desc?: string;
}

// categories as requested (image placeholders kept); titles will be shown on each card
const cards: Card[] = [
  { image: "https://via.placeholder.com/497x225.png?text=digital-keys", title: "Digital Keys", desc: "License keys & top-ups" },
  { image: "https://via.placeholder.com/497x225.png?text=games", title: "Games", desc: "Top game codes & bundles" },
  { image: "https://via.placeholder.com/497x225.png?text=ott", title: "OTT", desc: "Streaming services" },
  { image: "https://via.placeholder.com/497x225.png?text=premium", title: "Premium", desc: "Premium plans & upgrades" },
  { image: "https://via.placeholder.com/497x225.png?text=streaming-combos", title: "Streaming Combos", desc: "Combo subscriptions" },
  { image: "https://via.placeholder.com/497x225.png?text=utilities", title: "Utilities", desc: "Useful tools & apps" },
  { image: "https://via.placeholder.com/497x225.png?text=vpn", title: "VPN", desc: "Secure VPN plans" },
];

export default function PremiumSimpleHero() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
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
    padding: "60px 5% 0 5%",
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

  // slightly smaller card sizing
  const cardStyle = (image: string): React.CSSProperties => ({
    flex: "0 0 clamp(140px, 20%, 260px)",
    aspectRatio: "497/225",
    backgroundImage: `url(${image})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    borderRadius: "16px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    boxShadow: "0 6px 18px rgba(0,0,0,0.10)",
    transition: "transform 0.28s ease, box-shadow 0.28s ease",
    position: "relative",
    overflow: "hidden",
  });

  const buttonStyle: React.CSSProperties = {
    position: "absolute",
    bottom: "12px",
    left: "12px",
    padding: "7px 14px",
    backgroundColor: "#ffffff",
    color: "rgb(0, 84, 248)",
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

  const arrowStyle: React.CSSProperties = {
    fontSize: "16px",
    display: "inline-block",
    transition: "transform 0.25s",
  };

  // ---------- CSS (added overlay/title styles) ----------
  const css = `
    body, .page-wrap {
      font-family: "Montserrat", sans-serif !important;
    }

    .page-wrap {
      padding: 48px 5%;
      background: #ffffff;
      min-height: 100vh;
      color: #111;
    }

    .layout {
      max-width: 1180px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 320px;
      gap: 26px;
    }

    /* HERO SECTION */
    .hero-slider {
      position: relative;
      height: 520px;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 8px 26px rgba(0,0,0,0.15);
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
      background: linear-gradient(to bottom, rgba(0,0,0,0.08), rgba(0,0,0,0.55));
      z-index: 5;
    }

    .hero-content {
      position: absolute;
      bottom: 20px;
      left: 20px;
      z-index: 20;
      color: white;
      text-shadow: 0 3px 12px rgba(0,0,0,0.6);
    }
    .hero-content h3 {
      margin: 0;
      font-size: 2rem;
      font-weight: 800;
    }
    .hero-content p {
      margin-top: 6px;
      font-weight: 500;
      font-size: 1.05rem;
    }

    /* DOTS */
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
      background: #ffffff88;
      border-radius: 50%;
      cursor: pointer;
      border: none;
    }
    .dot.active {
      background: #fff;
    }

    /* SIDEBAR */
    .sidebar {
      background: #ffffff;
      border-radius: 10px;
      padding: 18px;
      border: 1px solid #e6e6e6;
      color: #222;
      box-shadow: 0 4px 14px rgba(0,0,0,0.06);
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
    }

    .discount-thumb {
      width: 56px;
      height: 56px;
      border-radius: 8px;
      overflow: hidden;
      background: #f3f3f3;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #eee;
    }

    .discount-thumb img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .discount-meta .name {
      font-weight: 700;
      font-size: 0.92rem;
      color: #333;
    }

    .discount-meta .price {
      font-weight: 800;
      color: #6b4de6;
      margin-top: 2px;
    }

    /* CARD overlays */
    .card-title {
      position: absolute;
      left: 12px;
      top: 12px;
      padding: 6px 10px;
      background: rgba(0,0,0,0.55);
      color: #fff;
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
      color: #ffffffcc;
      text-shadow: 0 2px 6px rgba(0,0,0,0.6);
      z-index: 11;
      line-height: 1.1;
      max-height: 3em;
      overflow: hidden;
    }

    @media(max-width:800px){
      .layout { grid-template-columns: 1fr; }
      .hero-slider { height: 300px; }
    }
  `;

  const fallbackImage = "/images/placeholder.svg";

  // simple handler — replace with your routing or action
  const onCardView = (card: Card) => {
    // small safe default action — you can change to navigate, open modal, etc.
    alert(`View: ${card.title ?? "item"}`);
  };

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

      {/* ---------- Campus / Category slider (full-width) ---------- */}
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
              {/* Title badge (Name) */}
              {card.title && <div className="card-title">{card.title}</div>}

              {/* Optional description overlay */}
              {card.desc && <div className="card-desc">{card.desc}</div>}

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
            background: linear-gradient(90deg, #0066ff, #00cc99);
            border-radius: 2px;
            animation: fadeInLine 1s ease forwards;
          }
          @keyframes fadeInLine { from { width: 0; opacity: 0; } to { width: 80px; opacity: 1; } }

          @media (max-width: 480px) { .campus-card { flex: 0 0 90% !important; } }
          @media (min-width: 481px) and (max-width: 1024px) { .campus-card { flex: 0 0 48% !important; } }
          @media (min-width: 1025px) { .campus-card { flex: 0 0 clamp(140px, 20%, 260px); } }

          @media (hover: hover) {
            .campus-card:hover { transform: scale(1.035); box-shadow: 0 12px 26px rgba(0,0,0,0.14); }
            .campus-card button:hover { background-color: rgb(0, 84, 248); color: #ffffff; }
            .campus-card button:hover span { transform: translateX(4px); }
          }
        `}</style>
      </div>
      {/* ---------- END ---------- */}
    </div>
  );
}
