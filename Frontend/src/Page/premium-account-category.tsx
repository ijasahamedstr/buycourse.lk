// AllAccountsWithCategory.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  description?: string;
  planDurations?: string[] | number[];
  images?: string[];
  accessLicenseTypes?: string[];
  videoQuality?: string;
  category?: string;
  createdAt?: string;
};

const formatPrice = (price: number) =>
  `LKR ${price.toLocaleString("en-LK", { minimumFractionDigits: 2 })}`;

interface Card {
  image: string;
  original?: string;
  title?: string;
  desc?: string;
}

const placeholderImage = "/images/placeholder.svg";

export default function AllAccountsWithCategory() {
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveSlugFromPath = () => {
    const parts = location.pathname.split("/").filter(Boolean);
    const idx = parts.findIndex((p) => p.toLowerCase() === "category");
    if (idx >= 0 && parts.length > idx + 1) return parts[idx + 1];
    return "all-accounts";
  };

  const SLUG_TITLE_MAP: Record<string, string> = {
    "all-accounts": "All Accounts",
    "digital-keys": "Digital Keys",
    games: "Games",
    ott: "OTT Services",
    premium: "Premium",
    "streaming-combos": "Streaming Combos",
    utilities: "Utilities",
    vpn: "VPN",
  };

  const activeSlug = getActiveSlugFromPath();

  const slugToReadable = (slug: string) => {
    if (!slug) return "All Accounts";
    const mapped = SLUG_TITLE_MAP[slug];
    if (mapped) return mapped;
    return decodeURIComponent(slug).replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

  // slider drag state
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

  // styles: rewritten card style to match screenshot
  const containerStyle: React.CSSProperties = { padding: "36px 8% 0 8%" };
  const sliderWrapperStyle: React.CSSProperties = {
    overflowX: "auto",
    display: "flex",
    gap: "clamp(18px, 3vw, 36px)",
    scrollBehavior: "smooth",
    cursor: isDragging ? "grabbing" : "grab",
    userSelect: "none",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    paddingBottom: 0,
  };

  const CARD_WIDTH = 320;
  const CARD_HEIGHT = 160;

  const cardOuterStyle = (bgImage: string): React.CSSProperties => ({
    flex: `0 0 ${CARD_WIDTH}px`,
    width: `${CARD_WIDTH}px`,
    height: `${CARD_HEIGHT}px`,
    borderRadius: 14,
    background: "#f4f7fb", // pale background
    boxShadow: "0 8px 22px rgba(13, 26, 41, 0.06)",
    display: "flex",
    alignItems: "center",
    padding: 16,
    gap: 12,
    position: "relative",
    overflow: "hidden",
  });

  const leftContentStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    flex: "1 1 auto",
    minWidth: 0,
  };

  const pillTitleStyle: React.CSSProperties = {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: 20,
    background: "#ffffff",
    boxShadow: "0 1px 0 rgba(0,0,0,0.02)",
    fontWeight: 700,
    fontSize: 13,
    alignSelf: "flex-start",
  };

  const descStyle: React.CSSProperties = {
    marginTop: 10,
    fontSize: 13,
    color: "#46535a",
    background: "rgba(255,255,255,0.6)",
    padding: "6px 10px",
    borderRadius: 12,
    maxWidth: "85%",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const viewPillStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 14px",
    borderRadius: 24,
    background: "#ffffff",
    border: "none",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(13,26,41,0.06)",
    fontSize: 13,
  };

  const rightThumbWrapper: React.CSSProperties = {
    width: 76,
    height: 76,
    borderRadius: 12,
    background: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 6px 12px rgba(13,26,41,0.06)",
    overflow: "hidden",
    flexShrink: 0,
  };

  const thumbImgStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  };

  // small arrow style (used in pills)
  const arrowStyle: React.CSSProperties = { fontSize: 14, display: "inline-block", transition: "transform 0.2s" };

  // navigation handler for services
  const onServiceView = (svc: Service) => {
    try {
      console.log("Service view:", svc.id);
    } catch (e) {
      // ignore
    }
    if (svc && svc.id) {
      navigate(`/service/${encodeURIComponent(svc.id)}`);
    }
  };

  // static cards example (can add original thumbnail image via `original`)
  const cards: Card[] = [
    { image: "https://shopallpremium.com/wp-content/uploads/2022/02/netflix.jpg.webp", original: "https://shopallpremium.com/wp-content/uploads/2022/02/netflix.jpg.webp", title: "Digital Keys", desc: "License keys & top-ups" },
    { image: "https://shopallpremium.com/wp-content/uploads/2022/02/primevideo.png.webp", original: "https://shopallpremium.com/wp-content/uploads/2022/02/primevideo.png.webp", title: "Games", desc: "Top game codes & bundles" },
    { image: "https://shopallpremium.com/wp-content/uploads/2022/02/45cc6c91692a3665d97b570a3272132a.jpg", original: "https://shopallpremium.com/wp-content/uploads/2022/02/45cc6c91692a3665d97b570a3272132a.jpg", title: "OTT", desc: "Streaming services" },
    { image: "https://shopallpremium.com/wp-content/uploads/2022/02/YouTube-Premium-512x512-1.png.webp", original: "https://shopallpremium.com/wp-content/uploads/2022/02/YouTube-Premium-512x512-1.png.webp", title: "Premium", desc: "Premium plans & upgrades" },
    { image: "https://via.placeholder.com/497x225.png?text=streaming-combos", original: "https://shopallpremium.com/wp-content/uploads/2022/02/altbalaji.png.webp", title: "Streaming Combos", desc: "Combo subscriptions" },
    { image: "https://shopallpremium.com/wp-content/uploads/2022/02/altbalaji.png.webp", title: "Utilities", desc: "Useful tools & apps" },
    { image: "https://shopallpremium.com/wp-content/uploads/2022/02/unnamed-33.png", title: "VPN", desc: "Secure VPN plans" },
     { image: "https://shopallpremium.com/wp-content/uploads/2022/02/unnamed-33.png", title: "AI", desc: "AI" },
  ];

  // data fetching (unchanged)
  const urlBase = import.meta.env.VITE_API_HOST ?? "";
  const [allData, setAllData] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // only category filter + pagination
  const [categoryFilter, setCategoryFilter] = useState<string>(
    activeSlug === "all-accounts" ? "" : activeSlug.replace(/-/g, " ")
  );
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const resp = await axios.get(`${urlBase}/Ottservice`);
        const items = Array.isArray(resp.data) ? resp.data : resp.data?.data ?? [];
        const mapped: Service[] = items.map((it: any, idx: number) => {
          const id = it.id ?? it._id ?? it.slug ?? `svc-${idx}`;
          const title = it.ottServiceName ?? it.title ?? it.name ?? `Service ${idx + 1}`;
          const priceRaw = Number(it.price ?? it.originalPrice ?? 0) || 0;
          const discountedRaw = it.discountedPrice !== undefined ? Number(it.discountedPrice) : undefined;
          const images: string[] = Array.isArray(it.images) ? it.images.filter(Boolean) : it.image ? [it.image] : [];
          const primaryImage =
            (Array.isArray(it.images) && it.images[0]) ||
            it.image ||
            (it.images && typeof it.images === "string" ? it.images : undefined) ||
            placeholderImage;
          const status: Service["status"] =
            it.status === "out-of-stock" ? "out-of-stock" : it.status === "trending" ? "trending" : "available";

          return {
            id: String(id),
            title: String(title),
            originalPrice: priceRaw,
            discountPrice: discountedRaw,
            image: primaryImage || placeholderImage,
            status,
            description: it.description,
            planDurations: it.planDurations,
            images,
            accessLicenseTypes: it.accessLicenseTypes,
            videoQuality: it.videoQuality,
            category: Array.isArray(it.category) ? it.category.join(", ") : it.category ?? it.tags ?? undefined,
            createdAt: it.createdAt ?? it.created_at ?? it.date ?? undefined,
          } as Service;
        });

        if (!cancelled) setAllData(mapped);
      } catch (err: any) {
        console.error("Failed to fetch ott services:", err);
        setError(err?.message ?? "Failed to fetch data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [urlBase]);

  // derive categories for chips
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    allData.forEach((s) => {
      if (s.category) {
        s.category
          .toString()
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean)
          .forEach((c) => set.add(c.toLowerCase()));
      }
    });
    cards.forEach((c) => {
      if (c.title) set.add(c.title.toLowerCase());
    });
    return Array.from(set).sort();
  }, [allData]);

  // filtering (only by category)
  const filteredData = allData.filter((s) => {
    if (!categoryFilter) return true;
    const normalizedCategory = (s.category ?? "").toString().toLowerCase();
    const slugNormalized = categoryFilter.toLowerCase();
    if (normalizedCategory.includes(slugNormalized) || s.title.toLowerCase().includes(slugNormalized)) return true;
    return false;
  });

  const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
  const paginated = filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, allData]);

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages) return;
    setCurrentPage(p);
    const el = document.querySelector(".all-accounts");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
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

  const applyCategoryFilterFromCard = (title?: string) => {
    if (!title) return;
    setCategoryFilter(title.toLowerCase());
    const el = document.querySelector(".all-accounts");
    setTimeout(() => el?.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
  };

  const clearCategoryFilter = () => setCategoryFilter("");

  const fallbackImage = placeholderImage;
  const readableTitle = categoryFilter ? categoryFilter.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : slugToReadable(activeSlug);

  // handler used by card button
  const onCardView = (card: Card) => {
    if (!card?.title) return;
    applyCategoryFilterFromCard(card.title);
  };

  return (
    <div className="page-wrap">
      <div style={{ padding: "12px 8%" }}>
        {loading && <div style={{ color: "#0b57d0" }}>Loading services…</div>}
        {error && <div style={{ color: "#d00" }}>Error: {error}</div>}
      </div>

      {/* category slider (new visual) */}
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
                  // don't navigate when dragging
                  if (dragged || isDragging) {
                    e.preventDefault();
                    return;
                  }
                  // prefer filter behavior (avoid direct navigation)
                  e.preventDefault();
                  onCardView(card);
                }}
              >
                <div style={cardOuterStyle(card.image)} aria-hidden={false}>
                  {/* left area: title, desc, view button */}
                  <div style={leftContentStyle}>
                    <div>
                      {card.title && <div style={pillTitleStyle}>{card.title}</div>}
                      {card.desc && <div style={descStyle}>{card.desc}</div>}
                    </div>

                    <div>
                      <button
                        style={viewPillStyle}
                        onClick={(e) => {
                          if (dragged || isDragging) {
                            e.preventDefault();
                            return;
                          }
                          e.preventDefault();
                          onCardView(card);
                        }}
                        aria-label={`View ${card.title ?? "item"}`}
                      >
                        View <span style={arrowStyle}>→</span>
                      </button>
                    </div>
                  </div>

                  {/* right area: logo/thumb */}
                  <div style={rightThumbWrapper} aria-hidden>
                    <img
                      src={card.original ?? card.image ?? fallbackImage}
                      alt={card.title ?? "thumb"}
                      style={thumbImgStyle}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = fallbackImage;
                      }}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* category chips */}
      <div style={{ padding: "18px 8%", paddingBottom: "32px", marginBottom: "16px", display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <strong style={{ marginRight: 8 }}>Categories:</strong>

          <button
            onClick={() => clearCategoryFilter()}
            style={{
              padding: "6px 10px",
              borderRadius: 20,
              border: "1px solid #ddd",
              background: categoryFilter ? "#fff" : "#1E4CA1",
              color: categoryFilter ? "#111" : "#fff",
              cursor: "pointer",
            }}
            aria-pressed={!categoryFilter}
            title="Show all"
          >
            All
          </button>

          {availableCategories.map((c) => {
            const isActive = c.toLowerCase() === categoryFilter.toLowerCase();
            return (
              <button
                key={c}
                onClick={() => {
                  setCategoryFilter(c);
                  const el = document.querySelector(".all-accounts");
                  setTimeout(() => el?.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
                }}
                style={{
                  padding: "6px 10px",
                  borderRadius: 20,
                  border: "1px solid #ddd",
                  background: isActive ? "#1E4CA1" : "#fff",
                  color: isActive ? "#fff" : "#111",
                  cursor: "pointer",
                  textTransform: "capitalize",
                }}
                aria-pressed={isActive}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      <section className="all-accounts" aria-label="All Accounts">
        <div className="all-accounts__header" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 14, color: "#111" }}>{filteredData.length} results</div>
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
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
              }}
            >
              <div className="account-card" role="article">
                <div className="account-card__img" style={{ backgroundImage: `url(${s.image ?? fallbackImage})` }} />

                <div className="account-card__meta">
                  <h4>{s.title}</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {s.originalPrice ? (
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>{formatPrice(s.originalPrice)}</div>
                        <div style={{ fontSize: 12, color: "#666", textDecoration: "line-through" }}>{formatPrice(s.originalPrice)}</div>
                      </div>
                    ) : (
                      <div style={{ fontSize: 14, fontWeight: 700 }}>{formatPrice(s.originalPrice)}</div>
                    )}
                  </div>

                  <button
                    style={{
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
                      fontSize: "13px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                    }}
                    onClick={(e) => {
                      if (dragged || isDragging) {
                        e.preventDefault();
                        return;
                      }
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

          {filteredData.length === 0 && !loading && <div style={{ padding: 24, color: "#666" }}>No services found.</div>}
        </div>

        <div className="all-accounts__pagination" role="navigation" aria-label="All accounts pagination">
          <button className="page-btn" onClick={() => goToPage(currentPage - 1)} aria-disabled={currentPage === 1} aria-label="Previous page">
            Prev
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button key={i} className="page-btn" onClick={() => goToPage(i + 1)} aria-current={currentPage === i + 1} aria-label={`Go to page ${i + 1}`}>
              {i + 1}
            </button>
          ))}

          <button className="page-btn" onClick={() => goToPage(currentPage + 1)} aria-disabled={currentPage === totalPages} aria-label="Next page">
            Next
          </button>
        </div>
      </section>
    </div>
  );
}
