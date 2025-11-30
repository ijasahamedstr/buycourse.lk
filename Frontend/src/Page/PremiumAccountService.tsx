import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Page/CSS/PremiumSimpleHero.css";

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

const fallbackImage = "/images/placeholder.svg";

const servicesData: Service[] = [
  { id: "netflix-4k", title: "Netflix Premium 4K UHD", originalPrice: 2590, discountPrice: 1490, image: "https://shopallpremium.com/wp-content/uploads/2022/02/netflix.jpg.webp", status: "available" },
  { id: "amazon-prime-video", title: "Amazon Prime Video", originalPrice: 1050, discountPrice: 260, image: "https://shopallpremium.com/wp-content/uploads/2022/02/primevideo.png.webp", status: "trending" },
  { id: "spotify-premium", title: "Spotify Premium", originalPrice: 999, discountPrice: 269, image: "https://shopallpremium.com/wp-content/uploads/2022/02/45cc6c91692a3665d97b570a3272132a.jpg", status: "out-of-stock" },
  { id: "youtube-premium-in", title: "YouTube Premium (India)", originalPrice: 1738, discountPrice: 878, image: "https://shopallpremium.com/wp-content/uploads/2022/02/YouTube-Premium-512x512-1.png.webp", status: "available" },
  { id: "altbalaji-premium", title: "ALTBalaji Premium", originalPrice: 1758, discountPrice: 760, image: "https://shopallpremium.com/wp-content/uploads/2022/02/altbalaji.png.webp", status: "available" },
  { id: "hma-vpn", title: "HMA VPN", originalPrice: 1999, discountPrice: 1249, image: "https://shopallpremium.com/wp-content/uploads/2022/02/unnamed-33.png", status: "available" },
];

const defaultHeroSlides = [
  "https://shopallpremium.com/wp-content/uploads/2022/02/netflix.jpg.webp",
  "https://shopallpremium.com/wp-content/uploads/2022/02/primevideo.png.webp",
  "https://shopallpremium.com/wp-content/uploads/2022/02/45cc6c91692a3665d97b570a3272132a.jpg",
];

const formatPrice = (price: number) =>
  `LKR ${price.toLocaleString("en-LK", { minimumFractionDigits: 2 })}`;

interface Card {
  image: string;
  original?: string;
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
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  type HeroSlide = {
    img: string;
    title?: string;
    id?: string;
    originalPrice?: number;
    discountPrice?: number;
    status?: Service["status"];
  };

  const [heroSlidesState, setHeroSlidesState] = useState<HeroSlide[]>(
    defaultHeroSlides.slice(0, 3).map((i, idx) => ({
      img: i,
      title: servicesData[idx]?.title,
      id: servicesData[idx]?.id,
      originalPrice: servicesData[idx]?.originalPrice,
      discountPrice: servicesData[idx]?.discountPrice,
      status: servicesData[idx]?.status,
    }))
  );

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [dragged, setDragged] = useState(false);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setDragged(false);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };
  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => {
    setIsDragging(false);
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

  const containerStyle: React.CSSProperties = { padding: "60px 8% 0 8%" };
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
  const CARD_WIDTH = 260;
  const CARD_HEIGHT = 150;
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
    backgroundColor: "#F1F5F9",
  });
  const buttonStyle: React.CSSProperties = {
    position: "absolute",
    bottom: "12px",
    left: "12px",
    padding: "7px 14px",
    backgroundColor: "#ffffff",
    color: "rgb(0, 0, 0)",
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
  const arrowStyle: React.CSSProperties = { fontSize: "16px", display: "inline-block", transition: "transform 0.25s" };
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

  const onCardView = (card: Card) => {
    if (!card.title) return;
    const target = `/category/${slugify(card.title)}`;
    navigate(target);
  };

  const onServiceView = (svc: Service) => {
    const targetById = `/service/${encodeURIComponent(svc.id)}`;
    navigate(targetById);
  };

  const [allData, setAllData] = useState<Service[]>(servicesData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const urlBase = import.meta.env.VITE_API_HOST ?? "";
        const resp = await axios.get(`${urlBase}/Ottservice`);
        const raw = Array.isArray(resp.data) ? resp.data : resp.data?.data ?? resp.data;
        if (!Array.isArray(raw)) throw new Error("Unexpected response shape");

        const mapped: Service[] = raw.map((it: any, idx: number) => {
          const id =
            it.id ??
            it._id ??
            (it.ottServiceName ? String(it.ottServiceName).toLowerCase().replace(/\s+/g, "-") : undefined) ??
            `service-${idx}`;
          const title = it.ottServiceName ?? it.title ?? it.name ?? `Service ${idx + 1}`;
          const priceNum = Number(it.price ?? it.originalPrice ?? NaN);
          const discountNum = it.discountedPrice !== undefined ? Number(it.discountedPrice) : undefined;
          const imagesArr = Array.isArray(it.images) ? it.images : it.image ? [it.image] : [];
          const img = imagesArr[0] ?? fallbackImage;

          const status: Service["status"] =
            it.inStock === false ? "out-of-stock" : (it.status as Service["status"]) ?? "available";

          const svc: Service = {
            id: String(id),
            title: String(title),
            originalPrice: Number.isFinite(priceNum) ? priceNum : 0,
            discountPrice: Number.isFinite(discountNum as number) ? (discountNum as number) : undefined,
            image: img,
            status,
          };
          return svc;
        });

        if (mounted && mapped.length > 0) {
          setAllData(mapped);
        } else if (mounted) {
          setAllData(servicesData);
        }
      } catch (err) {
        console.error("Failed to fetch Ottservice:", err);
        if (mounted) {
          setError("Could not load services — showing sample data.");
          setAllData(servicesData);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const heroItems = allData
      .filter(Boolean)
      .slice(0, 3)
      .map((s) => ({
        img: s.image ?? fallbackImage,
        title: s.title,
        id: s.id,
        originalPrice: s.originalPrice,
        discountPrice: s.discountPrice,
        status: s.status,
      }));

    if (heroItems.length > 0) {
      setHeroSlidesState(heroItems);
      setActiveIndex((prev) => (prev >= heroItems.length ? 0 : prev));
    } else {
      setHeroSlidesState(defaultHeroSlides.slice(0, 3).map((i) => ({ img: i })));
      setActiveIndex(0);
    }
  }, [allData]);

  useEffect(() => {
    if (!heroSlidesState || heroSlidesState.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroSlidesState.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [heroSlidesState.length]);

  const openPreview = (index: number) => {
    setPreviewIndex(index);
    setIsPreviewOpen(true);
    setActiveIndex(index);
  };
  const closePreview = () => setIsPreviewOpen(false);
  const gotoPrevPreview = () => setPreviewIndex((p) => (p - 1 + heroSlidesState.length) % heroSlidesState.length);
  const gotoNextPreview = () => setPreviewIndex((p) => (p + 1) % heroSlidesState.length);

  useEffect(() => {
    if (!isPreviewOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePreview();
      if (e.key === "ArrowLeft") gotoPrevPreview();
      if (e.key === "ArrowRight") gotoNextPreview();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isPreviewOpen, heroSlidesState.length]);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.max(1, Math.ceil(allData.length / ITEMS_PER_PAGE));
  const paginated = allData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages) return;
    setCurrentPage(p);
    const el = document.querySelector(".all-accounts");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const getValidDiscounted = () => {
    return allData.filter((s) => {
      const dNum = Number(s.discountPrice);
      const oNum = Number(s.originalPrice);
      if (!Number.isFinite(dNum)) return false;
      if (!Number.isFinite(oNum) || oNum <= 0) return false;
      if (dNum <= 0) return false;
      if (dNum >= oNum) return false;
      return true;
    });
  };

  const navigateToPreviewService = () => {
    const selected = heroSlidesState[previewIndex];
    if (selected?.id) {
      navigate(`/service/${encodeURIComponent(selected.id)}`);
    }
  };

  return (
    <div className="page-wrap">
      <div className="layout">
        {/* HERO IMAGE SLIDER (click a slide to preview) */}
        <div className="hero-slider" role="region" aria-label="Main hero slider">
          {heroSlidesState.map((item, i) => {
            const isActive = i === activeIndex;
            const priceLabel =
              item.discountPrice && item.originalPrice
                ? `${formatPrice(item.discountPrice)}`
                : item.originalPrice
                ? `${formatPrice(item.originalPrice)}`
                : null;

            return (
              <div
                key={i}
                className={`slide ${isActive ? "active" : ""}`}
                style={{
                  backgroundImage: `url(${item.img ?? fallbackImage})`,
                  cursor: "zoom-in",
                }}
                aria-hidden={!isActive}
                onClick={() => openPreview(i)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    openPreview(i);
                  }
                }}
              >
                <div className="slide-overlay" aria-hidden>
                  {item.status && <span className={`slide-badge slide-badge--${item.status}`}>{item.status}</span>}
                  {priceLabel && <span className="slide-price">{priceLabel}</span>}
                </div>

                <img
                  src={item.img ?? fallbackImage}
                  alt={item.title ?? `Slide ${i + 1}`}
                  style={{ display: "none" }}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = fallbackImage; }}
                />
              </div>
            );
          })}
          <div className="hero-content">
            <h3>Streaming & Premium Deals</h3>
            <p>Sri Lanka’s best daily offers — save more today!</p>
            {heroSlidesState[activeIndex]?.id ? (
              <button
                className="hero-cta"
                onClick={() => navigate(`/service/${encodeURIComponent(heroSlidesState[activeIndex].id!)}`)}
                aria-label="Open active service"
              >
                View Offer →
              </button>
            ) : null}
          </div>

          <div className="dots" role="tablist" aria-label="Hero slides">
            {heroSlidesState.map((_, i) => (
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

        {/* SIDEBAR - Only show valid discounts */}
        <aside className="sidebar" aria-label="Discounted services">
          <h3>Discounted</h3>

          {(() => {
            const discounted = getValidDiscounted();

            if (discounted.length === 0) {
              return (
                <div style={{ padding: 12, color: "#555", fontSize: 14 }}>
                  No discounted services available right now.
                </div>
              );
            }

            return (
              <div className="discount-list">
                {discounted.slice(0, 6).map((s) => {
                  const dNum = Number(s.discountPrice);
                  const oNum = Number(s.originalPrice);
                  const discountPercent = Math.round(((oNum - dNum) / oNum) * 100);

                  return (
                    <div key={s.id} className="discount-item">
                      <div className="discount-thumb" aria-hidden>
                        <img
                          src={s.image ?? fallbackImage}
                          alt={s.title}
                          onError={(e) => { (e.currentTarget as HTMLImageElement).src = fallbackImage; }}
                        />
                      </div>

                      <div className="discount-meta">
                        <div className="name">{s.title}</div>

                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ fontWeight: 700 }}>{formatPrice(dNum)}</div>

                          <div style={{ textDecoration: "line-through", color: "#777", fontSize: 13 }}>
                            {formatPrice(oNum)}
                          </div>

                          <div
                            style={{
                              background: "#ffecec",
                              color: "#c22",
                              padding: "2px 6px",
                              borderRadius: 6,
                              fontSize: 12,
                              fontWeight: 700,
                            }}
                            aria-hidden
                          >
                            -{discountPercent}%
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </aside>
      </div>

      {/* Category slider */}
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
            const to = `/category/${slugify(card.title)}`;
            return (
              <Link
                key={index}
                to={to}
                className="campus-card-link"
                style={{ textDecoration: "none", color: "inherit" }}
                role="listitem"
                aria-label={card.title ?? `Card ${index + 1}`}
                onClick={(e) => {
                  if (dragged || isDragging) {
                    e.preventDefault();
                    return;
                  }
                }}
              >
                <div className="campus-card" style={cardStyle(card.image)}>
                  {card.title && <div className="card-title">{card.title}</div>}
                  {card.desc && <div className="card-desc">{card.desc}</div>}
                  {card.original && (
                    <div style={originalThumbStyle} aria-hidden>
                      <img
                        src={card.original}
                        alt={`${card.title ?? "item"} original`}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = fallbackImage; }}
                      />
                    </div>
                  )}

                  <button
                    style={buttonStyle}
                    onClick={(e) => {
                      if (dragged || isDragging) { e.preventDefault(); return; }
                      e.preventDefault();
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

      {/* All Accounts grid */}
      <section className="all-accounts" aria-label="All Accounts">
        <div className="all-accounts__header">
          <div className="all-accounts__title">All Accounts</div>
          <div style={{ fontSize: 14, color: '#111' }}>
            {loading ? "Loading…" : `${allData.length} results`}
            {error ? ` — ${error}` : ""}
          </div>
        </div>

        <div className="all-accounts__grid">
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
              }}
            >
              <div className="account-card" role="article">
                <div className="account-card__img" style={{ backgroundImage: `url(${s.image})` }} />
                <div className="account-card__meta">
                  <h4>{s.title}</h4>
                  <p>{formatPrice(s.originalPrice)}</p>

                  <button
                    style={acctButtonStyle}
                    onClick={(e) => {
                      if (dragged || isDragging) { e.preventDefault(); return; }
                      e.preventDefault();
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
          {Array.from({ length: totalPages }).map((_, i) => (
            <button key={i} className="page-btn" onClick={() => goToPage(i + 1)} aria-current={currentPage === i + 1} aria-label={`Go to page ${i + 1}`}>{i + 1}</button>
          ))}
          <button className="page-btn" onClick={() => goToPage(currentPage + 1)} aria-disabled={currentPage === totalPages} aria-label="Next page">Next</button>
        </div>
      </section>

      {/* ---------- Image Preview Modal (Lightbox) ---------- */}
      {isPreviewOpen && (
        <div
          className="hero-preview-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Slide preview"
          onClick={closePreview}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <div
            className="hero-preview-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "1100px",
              width: "100%",
              maxHeight: "90vh",
              background: "#fff",
              borderRadius: 12,
              overflow: "hidden",
              position: "relative",
              boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
            }}
          >
            <button
              aria-label="Close preview"
              onClick={closePreview}
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                zIndex: 20,
                background: "rgba(255,255,255,0.9)",
                border: "none",
                padding: "8px 10px",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              ✕
            </button>

            <img
              src={heroSlidesState[previewIndex]?.img ?? fallbackImage}
              alt={heroSlidesState[previewIndex]?.title ?? `Slide ${previewIndex + 1}`}
              style={{
                display: "block",
                width: "100%",
                height: "auto",
                maxHeight: "calc(90vh - 80px)",
                objectFit: "contain",
                background: "#000",
              }}
            />

            <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 16, fontWeight: 600 }}>
                {heroSlidesState[previewIndex]?.title ?? `Slide ${previewIndex + 1}`}
              </div>

              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {heroSlidesState[previewIndex]?.id && (
                  <button
                    onClick={navigateToPreviewService}
                    aria-label="Open service page"
                    style={{ padding: "8px 12px", cursor: "pointer", fontWeight: 700 }}
                  >
                    Open service
                  </button>
                )}

                <button aria-label="Previous" onClick={gotoPrevPreview} style={{ padding: "8px 12px", cursor: "pointer" }}>← Prev</button>
                <button aria-label="Next" onClick={gotoNextPreview} style={{ padding: "8px 12px", cursor: "pointer" }}>Next →</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
