import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Page/CSS/PremiumSimpleHero.css";

import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

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
const placeholderImage = "https://via.placeholder.com/200x120.png?text=Image";

const sampleServices: Service[] = [
  {
    id: "netflix-4k",
    title: "Netflix Premium 4K UHD",
    originalPrice: 2590,
    discountPrice: 1490,
    image: "https://shopallpremium.com/wp-content/uploads/2022/02/netflix.jpg.webp",
    status: "available",
  },
  {
    id: "amazon-prime-video",
    title: "Amazon Prime Video",
    originalPrice: 1050,
    discountPrice: 260,
    image: "https://shopallpremium.com/wp-content/uploads/2022/02/primevideo.png.webp",
    status: "trending",
  },
  {
    id: "spotify-premium",
    title: "Spotify Premium",
    originalPrice: 999,
    discountPrice: 269,
    image:
      "https://shopallpremium.com/wp-content/uploads/2022/02/45cc6c91692a3665d97b570a3272132a.jpg",
    status: "out-of-stock",
  },
  {
    id: "youtube-premium-in",
    title: "YouTube Premium (India)",
    originalPrice: 1738,
    discountPrice: 878,
    image:
      "https://shopallpremium.com/wp-content/uploads/2022/02/YouTube-Premium-512x512-1.png.webp",
    status: "available",
  },
  {
    id: "altbalaji-premium",
    title: "ALTBalaji Premium",
    originalPrice: 1758,
    discountPrice: 760,
    image: "https://shopallpremium.com/wp-content/uploads/2022/02/altbalaji.png.webp",
    status: "available",
  },
  {
    id: "hma-vpn",
    title: "HMA VPN",
    originalPrice: 1999,
    discountPrice: 1249,
    image: "https://shopallpremium.com/wp-content/uploads/2022/02/unnamed-33.png",
    status: "available",
  },
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
    original: sampleServices.find((s) => s.id === "altbalaji-premium")?.image,
    title: "Digital Keys",
    desc: "License keys & top-ups",
  },
  {
    image: "https://via.placeholder.com/497x225.png?text=games",
    original: sampleServices.find((s) => s.id === "spotify-premium")?.image,
    title: "Games",
    desc: "Top game codes & bundles",
  },
  {
    image: "https://via.placeholder.com/497x225.png?text=ott",
    original: sampleServices.find((s) => s.id === "netflix-4k")?.image,
    title: "OTT",
    desc: "Streaming services",
  },
  {
    image: "https://via.placeholder.com/497x225.png?text=premium",
    original: sampleServices.find((s) => s.id === "youtube-premium-in")?.image,
    title: "Premium",
    desc: "Premium plans & upgrades",
  },
  {
    image: "https://via.placeholder.com/497x225.png?text=streaming-combos",
    original: sampleServices.find((s) => s.id === "amazon-prime-video")?.image,
    title: "Streaming Combos",
    desc: "Combo subscriptions",
  },
  {
    image: "https://via.placeholder.com/497x225.png?text=utilities",
    original: undefined,
    title: "Utilities",
    desc: "Useful tools & apps",
  },
  {
    image: "https://via.placeholder.com/497x225.png?text=vpn",
    original: sampleServices.find((s) => s.id === "hma-vpn")?.image,
    title: "VPN",
    desc: "Secure VPN plans",
  },
];

type HeroSlide = {
  img: string;
  title?: string;
  id?: string;
  originalPrice?: number;
  discountPrice?: number;
  status?: Service["status"];
};

export default function PremiumSimpleHero() {
  const navigate = useNavigate();

  const [allData, setAllData] = useState<Service[]>(sampleServices);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [heroSlidesState, setHeroSlidesState] = useState<HeroSlide[]>([]);
  const [, setActiveIndex] = useState(0);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // ---------- LARGE SHARED CONTAINER ----------
  const outerContainerStyle: React.CSSProperties = {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "32px 4% 60px",
  };

  const categoryBlockStyle: React.CSSProperties = {
    marginTop: 32,
  };

  const CARD_WIDTH = 260;
  const CARD_HEIGHT = 130;

  const cardOuterStyle: React.CSSProperties = {
    width: "100%",
    height: `${CARD_HEIGHT}px`,
    borderRadius: 16,
    background: "#020617",
    padding: "12px 12px 12px 14px",
    boxShadow: "0 10px 24px rgba(15,23,42,0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    transition: "transform 0.25s ease, box-shadow 0.25s ease",
    position: "relative",
    overflow: "hidden",
  };

  const leftContentStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
    color: "#E5E7EB",
    flex: 1,
    minWidth: 0,
  };

  const pillTitleStyle: React.CSSProperties = {
    display: "inline-flex",
    padding: "4px 10px",
    borderRadius: 999,
    background: "rgba(15,23,42,0.85)",
    border: "1px solid rgba(148,163,184,0.35)",
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 4,
    color: "#E5E7EB",
  };

  const descStyle: React.CSSProperties = {
    fontSize: 12,
    color: "#9CA3AF",
    maxWidth: "95%",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const viewPillStyle: React.CSSProperties = {
    padding: "5px 12px",
    borderRadius: 999,
    border: "none",
    outline: "none",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 600,
    background: "#F9FAFB",
    color: "#111827",
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    boxShadow: "0 4px 12px rgba(15,23,42,0.35)",
  };

  const rightThumbWrapper: React.CSSProperties = {
    width: 90,
    height: 90,
    borderRadius: 18,
    overflow: "hidden",
    background: "#0F172A",
    border: "1px solid rgba(148,163,184,0.5)",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const thumbImgStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  };

  // ⭐ HERO IMAGE SLIDER — FULL WIDTH, RESPONSIVE
  const heroSlideContainerStyle: React.CSSProperties = {
    position: "relative",
    width: "100%",
    maxWidth: "100%",
    margin: "0 auto",
    aspectRatio: "16 / 9",
    overflow: "hidden",
    borderRadius: 18,
    background: "#000",
    cursor: "pointer",
  };

  const heroSlideImageStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  };

  const acctButtonStyle: React.CSSProperties = {
    position: "absolute",
    bottom: 12,
    right: 12,
    padding: "7px 12px",
    backgroundColor: "#ffffff",
    color: "rgb(0,0,0)",
    border: "none",
    borderRadius: 32,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 13,
    display: "flex",
    alignItems: "center",
    gap: 8,
  };

  const arrowStyle: React.CSSProperties = {
    fontSize: 16,
    display: "inline-block",
    transition: "transform 0.25s",
  };

  // 🔶 Highlight bar for hero slide (BOTTOM: name + price + View/View more)
  const highlightBarStyle: React.CSSProperties = {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16, // moved to bottom
    display: "flex",
    flexDirection: "column",
    gap: 6,
    maxWidth: 420,
    padding: "12px 14px",
    borderRadius: 14,
    background:
      "linear-gradient(135deg, rgba(15,23,42,0.85), rgba(30,64,175,0.9))",
    color: "#F9FAFB",
    boxShadow: "0 12px 32px rgba(15,23,42,0.55)",
    backdropFilter: "blur(6px)",
  };

  const highlightLabelStyle: React.CSSProperties = {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontWeight: 700,
    opacity: 0.9,
  };

  const highlightTitleRowStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  };

  const highlightTitleStyle: React.CSSProperties = {
    fontSize: "clamp(14px, 2.3vw, 18px)",
    fontWeight: 700,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const highlightPriceStyle: React.CSSProperties = {
    fontSize: "clamp(13px, 2vw, 17px)",
    fontWeight: 700,
    color: "#FACC15",
    whiteSpace: "nowrap",
  };

  const highlightBtnRowStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  };

  const highlightPrimaryBtn: React.CSSProperties = {
    borderRadius: 999,
    padding: "6px 14px",
    fontSize: 12,
    fontWeight: 600,
    border: "none",
    cursor: "pointer",
    background: "#FACC15",
    color: "#111827",
  };

  const highlightSecondaryBtn: React.CSSProperties = {
    borderRadius: 999,
    padding: "6px 14px",
    fontSize: 12,
    fontWeight: 600,
    border: "1px solid rgba(249,250,251,0.75)",
    cursor: "pointer",
    background: "transparent",
    color: "#F9FAFB",
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
    navigate(`/category/${slugify(card.title)}`);
  };

  const onServiceView = (svc: Service) => {
    navigate(`/service/${encodeURIComponent(svc.id)}`);
  };

  // -------- Fetch Ottservice --------
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
            (it.ottServiceName
              ? String(it.ottServiceName).toLowerCase().replace(/\s+/g, "-")
              : undefined) ??
            `service-${idx}`;

          const title = it.ottServiceName ?? it.title ?? it.name ?? `Service ${idx + 1}`;
          const priceNum = Number(it.price ?? it.originalPrice ?? NaN);
          const discountNum =
            it.discountedPrice !== undefined ? Number(it.discountedPrice) : undefined;
          const imagesArr = Array.isArray(it.images) ? it.images : it.image ? [it.image] : [];
          const img = imagesArr[0] ?? fallbackImage;

          const status: Service["status"] =
            it.inStock === false
              ? "out-of-stock"
              : (it.status as Service["status"]) ?? "available";

          return {
            id: String(id),
            title: String(title),
            originalPrice: Number.isFinite(priceNum) ? priceNum : 0,
            discountPrice: Number.isFinite(discountNum as number)
              ? (discountNum as number)
              : undefined,
            image: img,
            status,
          };
        });

        if (mounted && mapped.length > 0) {
          setAllData(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch Ottservice; using sample data.", err);
        if (mounted) {
          setError("Could not load services — showing sample data.");
          setAllData(sampleServices);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  // --- heroSlidesState: LIFO ---
  useEffect(() => {
    if (!allData || allData.length === 0) {
      setHeroSlidesState([]);
      return;
    }

    const heroItems: HeroSlide[] = [...allData].reverse().map((s) => ({
      img: s.image ?? fallbackImage,
      title: s.title,
      id: s.id,
      originalPrice: s.originalPrice,
      discountPrice: s.discountPrice,
      status: s.status,
    }));

    setHeroSlidesState(heroItems);
    setActiveIndex(0);
  }, [allData]);

  // --- Preview / Lightbox ---
  const openPreview = (index: number) => {
    setPreviewIndex(index);
    setIsPreviewOpen(true);
  };
  const closePreview = () => setIsPreviewOpen(false);

  const gotoPrevPreview = () =>
    setPreviewIndex((p) => (p - 1 + heroSlidesState.length) % heroSlidesState.length);
  const gotoNextPreview = () =>
    setPreviewIndex((p) => (p + 1) % heroSlidesState.length);

  const navigateToPreviewService = () => {
    const selected = heroSlidesState[previewIndex];
    if (selected?.id) {
      navigate(`/service/${encodeURIComponent(selected.id)}`);
    }
  };

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

  const scrollToAllAccounts = () => {
    const el = document.querySelector(".all-accounts");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // --- pagination ---
  const totalPages = Math.max(1, Math.ceil(allData.length / ITEMS_PER_PAGE));
  const paginated = allData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages) return;
    setCurrentPage(p);
    scrollToAllAccounts();
  };

  // --- discounted ---
  const getValidDiscounted = () =>
    allData.filter((s) => {
      const dNum = Number(s.discountPrice);
      const oNum = Number(s.originalPrice);
      if (!Number.isFinite(dNum)) return false;
      if (!Number.isFinite(oNum) || oNum <= 0) return false;
      if (dNum <= 0) return false;
      if (dNum >= oNum) return false;
      return true;
    });

  const discounted = getValidDiscounted();

  return (
    <div className="page-wrap">
      <div style={outerContainerStyle}>
        {/* ---------- TOP LAYOUT: HERO + SIDEBAR (RESPONSIVE) ---------- */}
        <div
          className="layout"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 24,
            alignItems: "flex-start",
          }}
        >
          {/* HERO IMAGE SLIDER */}
          <div
            className="hero-slider"
            role="region"
            aria-label="Main hero slider"
            style={{ flex: "1 1 280px", minWidth: 0, height:"auto" }} // inline height 620px
          >
            <div className="hero-slider-media">
              <Swiper
                modules={[Pagination, Autoplay]}
                pagination={{ clickable: true }}
                autoplay={{ delay: 8000, disableOnInteraction: false }}
                loop={heroSlidesState.length > 1}
                onSlideChange={(swiper) => {
                  setActiveIndex(swiper.realIndex);
                }}
              >
                {heroSlidesState.map((item, i) => {
                  const priceLabel =
                    item.discountPrice && item.originalPrice
                      ? `${formatPrice(item.discountPrice)}`
                      : item.originalPrice
                      ? `${formatPrice(item.originalPrice)}`
                      : null;

                  return (
                    <SwiperSlide key={item.id ?? i}>
                      <div
                        className="slide-hero"
                        style={heroSlideContainerStyle}
                        onClick={() => openPreview(i)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") openPreview(i);
                        }}
                      >
                        <img
                          src={item.img ?? fallbackImage}
                          alt={item.title ?? `Slide ${i + 1}`}
                          className="slide-image-hero"
                          style={heroSlideImageStyle}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = fallbackImage;
                          }}
                        />

                        {/* 🔶 HIGHLIGHT BAR (BOTTOM) */}
                        <div style={highlightBarStyle}>
                          <div style={highlightLabelStyle}>Highlight</div>
                          <div style={highlightTitleRowStyle}>
                            <div style={highlightTitleStyle}>
                              {item.title ?? `Slide ${i + 1}`}
                            </div>
                            {priceLabel && (
                              <div style={highlightPriceStyle}>{priceLabel}</div>
                            )}
                          </div>
                          <div style={highlightBtnRowStyle}>
                            {item.id && (
                              <button
                                style={highlightPrimaryBtn}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/service/${encodeURIComponent(item.id!)}`);
                                }}
                              >
                                View Offer →
                              </button>
                            )}
                            <button
                              style={highlightSecondaryBtn}
                              onClick={(e) => {
                                e.stopPropagation();
                                scrollToAllAccounts();
                              }}
                            >
                              View More Deals
                            </button>
                          </div>
                        </div>

                        {/* slider index (TOP-LEFT now to avoid overlap) */}
                        <div
                          style={{
                            position: "absolute",
                            top: 12,
                            left: 16,
                            padding: "4px 10px",
                            borderRadius: 999,
                            background: "rgba(15,23,42,0.85)",
                            color: "#E5E7EB",
                            fontSize: 11,
                            fontWeight: 500,
                          }}
                        >
                          {i + 1} / {heroSlidesState.length}
                        </div>

                        {/* status badge (TOP-RIGHT) */}
                        {item.status && (
                          <span
                            className={`slide-badge slide-badge--${item.status}`}
                            style={{
                              position: "absolute",
                              top: 12,
                              right: 16,
                              padding: "4px 10px",
                              borderRadius: 999,
                              fontSize: 11,
                              textTransform: "uppercase",
                              letterSpacing: 0.5,
                              background: "rgba(15,23,42,0.85)",
                              color: "#E5E7EB",
                            }}
                          >
                            {item.status}
                          </span>
                        )}
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          </div>

          {/* ---------- SIDEBAR: DISCOUNTED ---------- */}
          <aside
            className="sidebar"
            aria-label="Discounted services"
            style={{ flex: "0 1 320px", minWidth: 260 }}
          >
            <h3>Discounted</h3>

            {discounted.length === 0 ? (
              <div style={{ padding: 12, color: "#555", fontSize: 14 }}>
                No discounted services available right now.
              </div>
            ) : (
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
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = fallbackImage;
                          }}
                        />
                      </div>

                      <div className="discount-meta">
                        <div className="name">{s.title}</div>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <div style={{ fontWeight: 700 }}>{formatPrice(dNum)}</div>

                          <div
                            style={{
                              textDecoration: "line-through",
                              color: "#777",
                              fontSize: 13,
                            }}
                          >
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
            )}
          </aside>
        </div>

        {/* ---------- CATEGORY AUTO SLIDER ---------- */}
        <div style={categoryBlockStyle}>
          <Swiper
            modules={[Autoplay]}
            slidesPerView={"auto"}
            spaceBetween={16}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={cards.length > 3}
            className="category-swiper"
          >
            {cards.map((card, index) => (
              <SwiperSlide
                key={index}
                style={{ width: `${CARD_WIDTH}px`, maxWidth: `${CARD_WIDTH}px` }}
              >
                <Link
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onCardView(card);
                  }}
                  style={{ textDecoration: "none" }}
                >
                  <div style={cardOuterStyle}>
                    <div style={leftContentStyle}>
                      <div>
                        {card.title && <div style={pillTitleStyle}>{card.title}</div>}
                        {card.desc && <div style={descStyle}>{card.desc}</div>}
                      </div>

                      <button
                        style={viewPillStyle}
                        onClick={(e) => {
                          e.preventDefault();
                          onCardView(card);
                        }}
                      >
                        View →
                      </button>
                    </div>

                    <div style={rightThumbWrapper}>
                      <img
                        src={card.original ?? card.image ?? placeholderImage}
                        alt={card.title}
                        style={thumbImgStyle}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = placeholderImage;
                        }}
                      />
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* ---------- ALL ACCOUNTS GRID (RESPONSIVE) ---------- */}
        <section
          className="all-accounts"
          aria-label="All Accounts"
          style={{ marginTop: 40 }}
        >
          <div className="all-accounts__header">
            <div className="all-accounts__title">All Accounts</div>
            <div style={{ fontSize: 14, color: "#111" }}>
              {loading ? "Loading…" : `${allData.length} results`}
              {error ? ` — ${error}` : ""}
            </div>
          </div>

          <div
            className="all-accounts__grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 20,
            }}
          >
            {paginated.map((s) => (
              <Link
                key={s.id}
                to={`/service/${encodeURIComponent(s.id)}`}
                style={{ textDecoration: "none", color: "inherit" }}
                aria-label={s.title}
              >
                <div className="account-card" role="article">
                  <div className="account-card__img">
                    <img
                      src={s.image ?? fallbackImage}
                      alt={s.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = fallbackImage;
                      }}
                    />
                  </div>
                  <div className="account-card__meta" style={{ position: "relative" }}>
                    <h4>{s.title}</h4>
                    <p>{formatPrice(s.originalPrice)}</p>

                    <button
                      style={acctButtonStyle}
                      onClick={(e) => {
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

          <div
            className="all-accounts__pagination"
            role="navigation"
            aria-label="All accounts pagination"
          >
            <button
              className="page-btn"
              onClick={() => goToPage(currentPage - 1)}
              aria-disabled={currentPage === 1}
              aria-label="Previous page"
            >
              Prev
            </button>
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
            <button
              className="page-btn"
              onClick={() => goToPage(currentPage + 1)}
              aria-disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </section>
      </div>

      {/* ---------- IMAGE PREVIEW MODAL ---------- */}
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
              alt={
                heroSlidesState[previewIndex]?.title ?? `Slide ${previewIndex + 1}`
              }
              style={{
                display: "block",
                width: "100%",
                height: "auto",
                maxHeight: "calc(90vh - 80px)",
                objectFit: "contain",
                background: "#000",
              }}
            />

            <div
              style={{
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 600 }}>
                {heroSlidesState[previewIndex]?.title ??
                  `Slide ${previewIndex + 1}`}
              </div>

              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {heroSlidesState[previewIndex]?.id && (
                  <button
                    onClick={navigateToPreviewService}
                    aria-label="Open service page"
                    style={{
                      padding: "8px 12px",
                      cursor: "pointer",
                      fontWeight: 700,
                    }}
                  >
                    Open service
                  </button>
                )}

                <button
                  aria-label="Previous"
                  onClick={gotoPrevPreview}
                  style={{ padding: "8px 12px", cursor: "pointer" }}
                >
                  ← Prev
                </button>
                <button
                  aria-label="Next"
                  onClick={gotoNextPreview}
                  style={{ padding: "8px 12px", cursor: "pointer" }}
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
