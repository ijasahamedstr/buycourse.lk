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

  const activeSlug = getActiveSlugFromPath();

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

  // styles
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

  const cardOuterStyle: React.CSSProperties = {
    flex: "0 0 320px",
    width: "320px",
    height: "160px",
    borderRadius: 14,
    background: "#f4f7fb",
    boxShadow: "0 8px 22px rgba(13, 26, 41, 0.06)",
    display: "flex",
    alignItems: "center",
    padding: 16,
    gap: 12,
    position: "relative",
    overflow: "hidden",
  };

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
    fontWeight: 700,
    fontSize: 13,
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
    fontSize: 13,
    boxShadow: "0 4px 10px rgba(13,26,41,0.06)",
  };

  const rightThumbWrapper: React.CSSProperties = {
    width: 76,
    height: 76,
    borderRadius: 12,
    background: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    boxShadow: "0 6px 12px rgba(13,26,41,0.06)",
    flexShrink: 0,
  };

  const thumbImgStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  };

  // navigation handler
  const onServiceView = (svc: Service) => {
    if (!svc?.id) return;
    navigate(`/service/${encodeURIComponent(svc.id)}`);
  };

  // static cards
  const cards: Card[] = [
    {
      image: "https://shopallpremium.com/wp-content/uploads/2022/02/netflix.jpg.webp",
      title: "Digital Keys",
      desc: "License keys & top-ups",
    },
    {
      image: "https://shopallpremium.com/wp-content/uploads/2022/02/primevideo.png.webp",
      title: "Games",
      desc: "Top game codes & bundles",
    },
    {
      image: "https://shopallpremium.com/wp-content/uploads/2022/02/45cc6c91692a3665d97b570a3272132a.jpg",
      title: "OTT",
      desc: "Streaming services",
    },
    {
      image: "https://shopallpremium.com/wp-content/uploads/2022/02/YouTube-Premium-512x512-1.png.webp",
      title: "Premium",
      desc: "Premium plans & upgrades",
    },
    {
      image: "https://via.placeholder.com/497x225.png?text=streaming-combos",
      title: "Streaming Combos",
      desc: "Combo subscriptions",
    },
    {
      image: "https://shopallpremium.com/wp-content/uploads/2022/02/altbalaji.png.webp",
      title: "Utilities",
      desc: "Useful tools & apps",
    },
    {
      image: "https://shopallpremium.com/wp-content/uploads/2022/02/unnamed-33.png",
      title: "VPN",
      desc: "Secure VPN plans",
    },
    {
      image: "https://shopallpremium.com/wp-content/uploads/2022/02/unnamed-33.png",
      title: "AI",
      desc: "AI",
    },
  ];

  // data fetching
  const urlBase = import.meta.env.VITE_API_HOST ?? "";
  const [allData, setAllData] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [categoryFilter, setCategoryFilter] = useState<string>(
    activeSlug === "all-accounts" ? "" : activeSlug.replace(/-/g, " ")
  );

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      try {
        const resp = await axios.get(`${urlBase}/Ottservice`);
        const items = Array.isArray(resp.data) ? resp.data : resp.data?.data ?? [];
        const mapped: Service[] = items.map((it: any, idx: number) => ({
          id: String(it.id ?? it._id ?? `svc-${idx}`),
          title: String(it.ottServiceName ?? it.title ?? `Service ${idx + 1}`),
          originalPrice: Number(it.price ?? 0),
          discountPrice: it.discountedPrice ? Number(it.discountedPrice) : undefined,
          image: it.images?.[0] || it.image || placeholderImage,
          status: "available",
          description: it.description,
          planDurations: it.planDurations,
          images: it.images,
          accessLicenseTypes: it.accessLicenseTypes,
          videoQuality: it.videoQuality,
          category: it.category,
          createdAt: it.createdAt,
        }));

        if (!cancelled) setAllData(mapped);
      } catch (err: any) {
        setError(err?.message ?? "Failed to fetch");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [urlBase]);

  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    allData.forEach((s) => {
      if (s.category) {
        s.category
          .toString()
          .split(",")
          .map((c) => c.trim().toLowerCase())
          .forEach((c) => set.add(c));
      }
    });
    cards.forEach((c) => {
      if (c.title) set.add(c.title.toLowerCase());
    });
    return [...set].sort();
  }, [allData]);

  const filteredData = allData.filter((s) => {
    if (!categoryFilter) return true;
    return s.category?.toLowerCase().includes(categoryFilter.toLowerCase());
  });

  const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
  const paginated = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter]);

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages) return;
    setCurrentPage(p);
    document
      .querySelector(".all-accounts")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const onCardView = (card: Card) => {
    if (!card?.title) return;
    setCategoryFilter(card.title.toLowerCase());
  };

  return (
    <div className="page-wrap">
      {/* loading/error */}
      <div style={{ padding: "12px 8%" }}>
        {loading && <div style={{ color: "#0b57d0" }}>Loading services…</div>}
        {error && <div style={{ color: "#d00" }}>Error: {error}</div>}
      </div>

      {/* category slider */}
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
        >
          {cards.map((card, index) => (
            <Link
              key={index}
              to="#"
              onClick={(e) => {
                if (dragged) {
                  e.preventDefault();
                  return;
                }
                e.preventDefault();
                onCardView(card);
              }}
              style={{ textDecoration: "none" }}
            >
              <div style={cardOuterStyle}>
                <div style={leftContentStyle}>
                  <div>
                    {card.title && (
                      <div style={pillTitleStyle}>{card.title}</div>
                    )}
                    {card.desc && <div style={descStyle}>{card.desc}</div>}
                  </div>

                  <button
                    style={viewPillStyle}
                    onClick={(e) => {
                      if (dragged) {
                        e.preventDefault();
                        return;
                      }
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
                      (e.currentTarget as HTMLImageElement).src =
                        placeholderImage;
                    }}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* category chips */}
      <div
        style={{
          padding: "20px 8%",
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <strong>Categories:</strong>

        <button
          onClick={() => setCategoryFilter("")}
          style={{
            padding: "6px 10px",
            borderRadius: 20,
            background: categoryFilter ? "#fff" : "#1E4CA1",
            color: categoryFilter ? "#000" : "#fff",
          }}
        >
          All
        </button>

        {availableCategories.map((c) => {
          const isActive = c === categoryFilter.toLowerCase();
          return (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              style={{
                padding: "6px 10px",
                borderRadius: 20,
                background: isActive ? "#1E4CA1" : "#fff",
                color: isActive ? "#fff" : "#000",
              }}
            >
              {c}
            </button>
          );
        })}
      </div>

      {/* results */}
      <section className="all-accounts">
        <div className="all-accounts__header">
          <div>{filteredData.length} results</div>
        </div>

        <div className="all-accounts__grid">
          {paginated.map((s) => (
            <Link
              key={s.id}
              to={`/service/${encodeURIComponent(s.id)}`}
              style={{ textDecoration: "none" }}
            >
              <div className="account-card">
                <div
                  className="account-card__img"
                  style={{ backgroundImage: `url(${s.image})` }}
                />
                <div className="account-card__meta">
                  <h4>{s.title}</h4>
                  <div>
                    <div
                      style={{ fontSize: 14, fontWeight: 700 }}
                    >
                      {formatPrice(s.originalPrice)}
                    </div>
                  </div>

                  <button
                    style={{
                      position: "absolute",
                      bottom: 12,
                      right: 12,
                      padding: "7px 12px",
                      borderRadius: 32,
                      background: "#fff",
                      boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                      border: "none",
                      cursor: "pointer",
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      onServiceView(s);
                    }}
                  >
                    View →
                  </button>
                </div>
              </div>
            </Link>
          ))}

          {!loading && filteredData.length === 0 && (
            <div style={{ padding: 24, color: "#666" }}>
              No services found.
            </div>
          )}
        </div>

        {/* pagination */}
        <div className="all-accounts__pagination">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i + 1)}
              className={currentPage === i + 1 ? "active" : ""}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </section>
    </div>
  );
}
