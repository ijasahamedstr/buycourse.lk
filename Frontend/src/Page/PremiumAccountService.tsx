import React, { useEffect, useRef, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import type { CSSProperties } from "react";

/**
 * PremiumAccountService (Single-file React component)
 * - Improved, modern visual design with responsive grid
 * - CSS injected via a <style> tag so hover, media queries and focus states work
 * - Accessible labels, improved badges, out-of-stock treatment
 * - Keeps dynamic Rellax import (no-op if not installed)
 */

type Service = {
  id: string;
  title: string;
  originalPrice: number;
  discountPrice?: number;
  discount?: string;
  rating: number; // 0-5
  image: string;
  status: "available" | "out-of-stock" | "best-value" | "trending";
};

const servicesData: Service[] = [
  { id: "netflix-4k", title: "Netflix Premium 4K UHD", originalPrice: 25.99, discountPrice: 14.9, discount: "-40%", rating: 5, image: "https://shopallpremium.com/wp-content/uploads/2022/02/netflix.jpg.webp", status: "available" },
  { id: "amazon-prime-video", title: "Amazon Prime Video", originalPrice: 10.5, discountPrice: 1.26, discount: "-77%", rating: 4, image: "https://shopallpremium.com/wp-content/uploads/2022/02/primevideo.png.webp", status: "trending" },
  { id: "spotify-premium", title: "Spotify Premium", originalPrice: 9.99, discountPrice: 2.69, discount: "-73%", rating: 4, image: "https://shopallpremium.com/wp-content/uploads/2022/02/45cc6c91692a3665d97b570a3272132a.jpg", status: "out-of-stock" },
  { id: "youtube-premium-in", title: "YouTube Premium (India)", originalPrice: 17.38, discountPrice: 8.78, discount: "-50%", rating: 3, image: "https://shopallpremium.com/wp-content/uploads/2022/02/YouTube-Premium-512x512-1.png.webp", status: "available" },
  { id: "altbalaji-premium", title: "ALTBalaji Premium", originalPrice: 17.58, discountPrice: 0.76, discount: "-96%", rating: 3, image: "https://shopallpremium.com/wp-content/uploads/2022/02/altbalaji.png.webp", status: "available" },
  { id: "hma-vpn", title: "HMA VPN", originalPrice: 19.99, discountPrice: 12.49, discount: "-60%", rating: 5, image: "https://shopallpremium.com/wp-content/uploads/2022/02/unnamed-33.png", status: "available" },
  { id: "nord-vpn-hotstar", title: "Nord VPN Hotstar", originalPrice: 13.99, discountPrice: 7.99, discount: "-46%", rating: 5, image: "https://shopallpremium.com/wp-content/uploads/2022/02/HMA-LOG.png", status: "best-value" },
  { id: "disney-hotstar", title: "Disney+ Hotstar", originalPrice: 10.99, discountPrice: 3.99, discount: "-64%", rating: 4, image: "https://shopallpremium.com/wp-content/uploads/2023/09/unnamed-6.png", status: "out-of-stock" },
  { id: "sun-nxt", title: "Sun NXT", originalPrice: 9.99, discountPrice: 3.99, discount: "-60%", rating: 3, image: "https://shopallpremium.com/wp-content/uploads/2022/02/unnamed-2.png", status: "out-of-stock" },
  { id: "hoichoi-bengali-movies", title: "Hoichoi Bengali Movies", originalPrice: 3.99, discountPrice: 1.99, discount: "-50%", rating: 3, image: "https://shopallpremium.com/wp-content/uploads/2022/02/sonyliv-1.png", status: "out-of-stock" },
];

const formatPrice = (price: number) => `$${price.toFixed(2)}`;

const slugify = (text: string) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "")
    .replace(/\-+/g, "-");

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="stars" aria-label={`Rating: ${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={`star ${i < rating ? "filled" : "empty"}`}>★</span>
      ))}
    </div>
  );
};

const statusLabels: Record<Service["status"], string> = {
  "best-value": "Best value",
  trending: "Trending",
  "out-of-stock": "Out of stock",
  available: "",
};

const PremiumAccountService: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const servicesPerPage = 8;
  const totalPages = Math.max(1, Math.ceil(servicesData.length / servicesPerPage));

  const indexOfLast = currentPage * servicesPerPage;
  const indexOfFirst = indexOfLast - servicesPerPage;

  const currentServices = useMemo(() => servicesData.slice(indexOfFirst, indexOfLast), [indexOfFirst, indexOfLast]);

  const circleRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let instance: any = null;
    if (typeof window !== "undefined" && circleRef.current) {
      (async () => {
        try {
          const mod = await import("rellax");
          const Rellax = mod?.default || mod;
          instance = new Rellax(circleRef.current, { speed: -3, center: false, round: true });
        } catch (e) {
          // rellax not present — silently continue
        }
      })();
    }
    return () => {
      if (instance && typeof instance.destroy === "function") instance.destroy();
    };
  }, []);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      try {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch {}
    }
  };

  // CSS string injected so we can use :hover and media queries
  const css = `
    :root{ --bg:#ffffff; --muted:#9ca3af; --accent:#0a5397; --accent-2:#ef4444; --card-shadow: 0 6px 22px rgba(2,6,23,0.06); }

    .premium-wrap{ position:relative; overflow:hidden; padding:56px 5%; background:linear-gradient(180deg,#fbfdff 0%, #ffffff 40%); font-family: Inter, Poppins, system-ui, sans-serif; }
    .bg-circle{ position:absolute; left:-140px; top:-120px; width:460px; height:460px; border-radius:50%; background: radial-gradient(circle at 30% 30%, #e3f2fd 0%, rgba(163,188,255,0.18) 40%, transparent 60%); z-index:0; filter: blur(6px); }
    .container{ position:relative; z-index:1; max-width:1200px; margin:0 auto; text-align:center; }

    h1.title{ font-size:2rem; margin:0 0 6px; letter-spacing:0.6px; color:#0f172a; text-transform:uppercase; font-weight:800; }
    h2.subtitle{ font-size:1rem; margin:0 0 24px; color:var(--muted); font-weight:600; }

    .grid{ display:grid; gap:20px; grid-template-columns: repeat(4, minmax(0,1fr)); align-items:stretch; }

    /* Responsive */
    @media (max-width:1024px){ .grid{ grid-template-columns: repeat(3, 1fr); } }
    @media (max-width:800px){ .grid{ grid-template-columns: repeat(2, 1fr); } .premium-wrap{ padding:36px 4%; } }
    @media (max-width:420px){ .grid{ grid-template-columns: 1fr; padding:0 8px; } h1.title{ font-size:1.4rem; } }

    .card{ background:var(--bg); border-radius:14px; overflow:hidden; text-decoration:none; color:inherit; display:flex; flex-direction:column; transition: transform .28s cubic-bezier(.22,.9,.32,1), box-shadow .28s; box-shadow: var(--card-shadow); border:1px solid rgba(10,37,64,0.03); position:relative; min-height:240px; }
    .card:focus{ outline:3px solid rgba(10,83,151,0.12); outline-offset:3px; }
    .card:hover{ transform:translateY(-8px); box-shadow: 0 18px 40px rgba(2,6,23,0.12); }

    .media{ padding:20px; display:flex; align-items:center; justify-content:center; min-height:120px; }
    .media img{ width:88px; height:88px; object-fit:contain; border-radius:12px; background:linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7)); }

    .info{ padding:12px 16px 18px; display:flex; flex-direction:column; gap:8px; flex-grow:1; }
    .title-small{ font-weight:700; font-size:0.95rem; color:#0f172a; line-height:1.25; }

    .price-row{ display:flex; align-items:center; gap:10px; justify-content:center; margin-top:auto; }
    .original{ color:var(--muted); font-size:0.82rem; text-decoration:line-through; }
    .final{ font-weight:800; font-size:1rem; color: #071133; }

    .badge-discount{ position:absolute; left:12px; top:12px; padding:6px 10px; font-weight:800; font-size:0.75rem; color:#fff; border-radius:10px; background:var(--accent-2); box-shadow: 0 6px 16px rgba(239,68,68,0.14); }
    .badge-status{ position:absolute; right:12px; top:12px; padding:6px 10px; font-weight:700; font-size:0.72rem; color:#fff; border-radius:10px; background:var(--accent); box-shadow: 0 6px 16px rgba(10,83,151,0.08); }

    .stars{ display:inline-flex; gap:4px; justify-content:center; }
    .star{ font-size:0.95rem; line-height:1; }
    .star.filled{ color:#ffb020; }
    .star.empty{ color:#e7e9ee; }

    .out-overlay{ position:absolute; inset:0; display:flex; align-items:center; justify-content:center; background:rgba(255,255,255,0.86); font-weight:800; color:#ef4444; font-size:0.95rem; border-radius:14px; pointer-events:none; }

    .pagination{ display:flex; gap:8px; justify-content:center; margin-top:34px; align-items:center; }
    .page-btn{ width:36px; height:36px; border-radius:18px; border:none; background:#f3f4f6; font-weight:700; cursor:pointer; }
    .page-btn.active{ background:var(--accent); color:#fff; }
    .nav-btn{ width:36px; height:36px; border-radius:18px; border:none; background:#f3f4f6; cursor:pointer; }

  `;

  return (
    <section className="premium-wrap" aria-labelledby="premium-heading">
      <style>{css}</style>
      <div ref={circleRef} className="bg-circle" aria-hidden />

      <div className="container">
        <h1 id="premium-heading" className="title">Streaming & VPN Services</h1>
        <h2 className="subtitle">Unlock global content — secure your connection</h2>

        <div className="grid" role="list">
          {currentServices.map((service) => (
            <Link
              role="listitem"
              to={`/premium-service/${slugify(service.id)}`}
              key={service.id}
              className="card"
              aria-disabled={service.status === "out-of-stock"}
              tabIndex={0}
            >
              {service.discount && <div className="badge-discount">{service.discount}</div>}
              {service.status !== "available" && <div className="badge-status">{statusLabels[service.status]}</div>}

              <div className="media">
                <img src={service.image} alt={service.title} loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.svg'; }} />
              </div>

              <div className="info">
                <div>
                  <div className="title-small">{service.title}</div>
                  <div style={{ marginTop: 6 }}>
                    <StarRating rating={service.rating} />
                  </div>
                </div>

                <div className="price-row" aria-hidden>
                  <div className="original">{formatPrice(service.originalPrice)}</div>
                  <div className="final">{formatPrice(service.discountPrice ?? service.originalPrice)}</div>
                </div>
              </div>

              {service.status === "out-of-stock" && <div className="out-overlay">Out of stock</div>}
            </Link>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="pagination" aria-label="pagination navigation">
            <button className="nav-btn" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} aria-label="Previous page">‹</button>
            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  className={`page-btn ${currentPage === page ? "active" : ""}`}
                  onClick={() => goToPage(page)}
                  aria-current={currentPage === page ? "page" : undefined}
                >
                  {page}
                </button>
              );
            })}
            <button className="nav-btn" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} aria-label="Next page">›</button>
          </div>
        )}
      </div>
    </section>
  );
};

export default PremiumAccountService;
