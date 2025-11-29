import React, { useEffect, useState } from "react";

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
  { id: "netflix-4k", title: "Netflix Premium 4K UHD", originalPrice: 25.99, discountPrice: 14.9, image: "https://shopallpremium.com/wp-content/uploads/2022/02/netflix.jpg.webp", status: "available" },
  { id: "amazon-prime-video", title: "Amazon Prime Video", originalPrice: 10.5, discountPrice: 1.26, image: "https://shopallpremium.com/wp-content/uploads/2022/02/primevideo.png.webp", status: "trending" },
  { id: "spotify-premium", title: "Spotify Premium", originalPrice: 9.99, discountPrice: 2.69, image: "https://shopallpremium.com/wp-content/uploads/2022/02/45cc6c91692a3665d97b570a3272132a.jpg", status: "out-of-stock" },
  { id: "youtube-premium-in", title: "YouTube Premium (India)", originalPrice: 17.38, discountPrice: 8.78, image: "https://shopallpremium.com/wp-content/uploads/2022/02/YouTube-Premium-512x512-1.png.webp", status: "available" },
  { id: "altbalaji-premium", title: "ALTBalaji Premium", originalPrice: 17.58, discountPrice: 0.76, image: "https://shopallpremium.com/wp-content/uploads/2022/02/altbalaji.png.webp", status: "available" },
  { id: "hma-vpn", title: "HMA VPN", originalPrice: 19.99, discountPrice: 12.49, image: "https://shopallpremium.com/wp-content/uploads/2022/02/unnamed-33.png", status: "available" },
];

const heroSlides = [
  "https://shopallpremium.com/wp-content/uploads/2022/02/netflix.jpg.webp",
  "https://shopallpremium.com/wp-content/uploads/2022/02/primevideo.png.webp",
  "https://shopallpremium.com/wp-content/uploads/2022/02/45cc6c91692a3665d97b570a3272132a.jpg",
];

const formatPrice = (price: number) => `₹${price.toFixed(2)}`;

export default function PremiumSimpleHero() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap');

    * {
      font-family: "Montserrat", sans-serif !important;
    }

    :root{ 
      --text-dark:#1a1a1a;
      --text-light:#555;
      --border:#e5e7eb;
      --card-bg:#ffffff;
    }

    .page-wrap{ 
      padding:48px 5%; 
      background:#ffffff;   /* White Background */
      min-height:100vh; 
      color:var(--text-dark);
    }

    .layout{ 
      max-width:1180px; 
      margin:0 auto; 
      display:grid; 
      grid-template-columns:1fr 320px; 
      gap:26px; 
    }

    /* HERO SLIDER (same sizes, only overlay stronger) */
    .hero-slider{
      position:relative;
      height:520px;
      border-radius:12px;
      overflow:hidden;
      box-shadow:0 12px 36px rgba(0,0,0,0.15);
    }

    .slide{
      position:absolute; inset:0;
      background-size:cover;
      background-position:center;
      opacity:0;
      transition:opacity 1s ease-in-out;
    }

    .slide.active{ opacity:1; }

    /* Stronger gradient overlay */
    .hero-slider::after{
      content:"";
      position:absolute;
      inset:0;
      background:linear-gradient(
        to bottom, 
        rgba(0,0,0,0.0), 
        rgba(0,0,0,0.75)
      );
      z-index:10;
    }

    .hero-content{
      position:absolute; 
      bottom:20px; 
      left:20px;
      color:#fff; 
      z-index:20;
    }

    .hero-content h3{ 
      margin:0; 
      font-size:2rem; 
      font-weight:800; 
    }

    .hero-content p{ 
      margin-top:6px; 
      font-weight:500; 
      font-size:1.05rem; 
    }

    /* DOTS (same style) */
    .dots{
      position:absolute; bottom:12px; right:20px;
      display:flex; gap:8px; 
      z-index:30;
    }

    .dot{
      width:10px; height:10px;
      background:#ffffff80;
      border-radius:50%;
      cursor:pointer;
      border:2px solid #fff;
    }
    .dot.active{ background:#fff; }

    /* SIDEBAR — White Card */
    .sidebar{
      background:var(--card-bg);
      border-radius:12px;
      padding:18px;
      border:1px solid var(--border);
    }

    .sidebar h3{
      margin:0 0 12px; 
      font-size:1.05rem; 
      font-weight:700; 
      color:var(--text-dark);
    }

    /* DISCOUNT ITEMS — modern soft style */
    .discount-list{
      display:flex; 
      flex-direction:column; 
      gap:12px;
    }

    .discount-item{
      display:flex; 
      gap:12px; 
      align-items:center; 
      padding:10px; 
      border-radius:10px;
      background:#f9fafb;
      border:1px solid #e5e7eb;
      transition:0.2s ease;
    }

    .discount-item:hover{
      background:#f3f4f6;
    }

    .discount-thumb{
      width:56px; 
      height:56px; 
      border-radius:8px; 
      overflow:hidden; 
      background:#eee;
      display:flex; 
      align-items:center; 
      justify-content:center; 
    }

    .discount-thumb img{
      width:100%; height:100%; object-fit:cover;
    }

    .discount-meta .name{
      font-weight:600; 
      font-size:0.92rem; 
      color:var(--text-dark);
    }

    .discount-meta .price{
      font-weight:700; 
      color:#7c3aed; 
    }

    @media(max-width:800px){
      .layout{ grid-template-columns:1fr; }
      .hero-slider{ height:300px; }
    }
  `;

  const fallbackImage = "/images/placeholder.svg";

  return (
    <div className="page-wrap">
      <style>{css}</style>

      <div className="layout">

        {/* HERO IMAGE SLIDER */}
        <div className="hero-slider">
          {heroSlides.map((img, i) => (
            <div
              key={i}
              className={`slide ${i === activeIndex ? "active" : ""}`}
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}

          <div className="hero-content">
            <h3>Featured — Streaming & Premium Offers</h3>
            <p>Exclusive offers updated daily. Best prices guaranteed.</p>
          </div>

          <div className="dots">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                className={`dot ${activeIndex === i ? "active" : ""}`}
                onClick={() => setActiveIndex(i)}
              />
            ))}
          </div>
        </div>

        {/* DISCOUNTED SIDEBAR */}
        <aside className="sidebar">
          <h3 style={{}}>Discounted</h3>

          <div className="discount-list">
            {servicesData.slice(0, 6).map((s) => (
              <div key={s.id} className="discount-item">
                <div className="discount-thumb">
                  <img
                    src={s.image}
                    alt={s.title}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = fallbackImage; }}
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
    </div>
  );
}
