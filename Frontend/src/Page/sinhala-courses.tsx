import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { CSSProperties } from "react";

/**
 * Sinhala Courses Page
 *
 * - Lists only Sinhala courses (sample data included)
 * - Card layout, hover lift, equal heights, pagination
 * - Safe dynamic import of Rellax for parallax circle
 */

// Course type
type Course = {
  id: string;
  title: string;
  instructor: string;
  price?: string;
  duration?: string;
  image: string;
  description: string;
  category?: string;
};

// Sample Sinhala courses — replace with your real data
const sinhalaCoursesData: Course[] = [
  {
    id: "sinhala-beginner",
    title: "Sinhala Essentials",
    instructor: "Dr. Malini",
    price: "LKR 3,499",
    duration: "3 months",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1600&q=80",
    description:
      "Essential Sinhala for beginners — pronunciation, grammar and everyday conversations to get you started.",
    category: "sinhala",
  },
  {
    id: "sinhala-conversation",
    title: "Sinhala Conversation",
    instructor: "Ms. Nadeesha",
    price: "LKR 3,999",
    duration: "3 months",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1600&q=80",
    description: "Interactive Sinhala classes focused on speaking and listening.",
    category: "sinhala",
  },
  {
    id: "sinhala-reading",
    title: "Sinhala Reading & Writing",
    instructor: "Mr. Perera",
    price: "LKR 3,299",
    duration: "2 months",
    image:
      "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=1600&q=80",
    description:
      "Build reading and writing skills in Sinhala for daily use and study.",
    category: "sinhala",
  },
  {
    id: "sinhala-business",
    title: "Business Sinhala",
    instructor: "Ms. Fernando",
    price: "LKR 5,499",
    duration: "4 months",
    image:
      "https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&w=1600&q=80",
    description: "Professional Sinhala for workplace communication and meetings.",
    category: "sinhala",
  },
  {
    id: "sinhala-children",
    title: "Sinhala for Kids",
    instructor: "Miss Kavindi",
    price: "LKR 2,199",
    duration: "2 months",
    image:
      "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=1600&q=80",
    description:
      "Fun Sinhala lessons for children with songs, stories and activities.",
    category: "sinhala",
  },
  {
    id: "sinhala-advanced",
    title: "Advanced Sinhala Literature",
    instructor: "Prof. Jayasuriya",
    price: "LKR 6,499",
    duration: "4 months",
    image:
      "https://images.unsplash.com/photo-1517638808067-8f7f2f4b8a04?auto=format&fit=crop&w=1600&q=80",
    description:
      "Deep-dive into Sinhala literature and critical analysis.",
    category: "sinhala",
  },
];

// slugify helper
const slugify = (text: string) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "")
    .replace(/\-+/g, "-");

// styles (converted from your News styles)
const styles: Record<string, CSSProperties> = {
  sectionWrapper: { position: "relative", overflow: "hidden", zIndex: 1 },
  backgroundCircle: {
    position: "absolute",
    top: "-120px",
    left: "-120px",
    width: "420px",
    height: "420px",
    borderRadius: "50%",
    backgroundColor: "#e3f2fd",
    zIndex: 0,
  },
  container: {
    position: "relative",
    backgroundColor: "#fff",
    padding: "48px 5%",
    textAlign: "center",
    fontFamily: "'Poppins', sans-serif",
    zIndex: 1,
  },
  title: {
    fontSize: "2.25rem",
    fontWeight: 700,
    color: "#111827",
    marginBottom: "0.25rem",
    fontFamily: "'Montserrat', sans-serif",
  },
  subtitle: {
    fontSize: "1.15rem",
    fontWeight: 600,
    color: "#4b5563",
    marginBottom: "1.75rem",
    fontFamily: "'Montserrat', sans-serif",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px",
    maxWidth: "1200px",
    margin: "0 auto",
    alignItems: "stretch",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
    textAlign: "left",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    transition: "transform 0.28s ease, box-shadow 0.28s ease",
  },
  image: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    display: "block",
  },
  info: {
    padding: "16px",
    color: "#111827",
    fontFamily: "'Montserrat', sans-serif",
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  eventName: {
    fontSize: "1.05rem",
    fontWeight: 700,
    margin: "0 0 8px 0",
    color: "#0a5397",
  },
  date: {
    fontSize: "0.9rem",
    color: "#6b7280",
    marginBottom: "8px",
  },
  description: { fontSize: "0.95rem", color: "#374151", marginBottom: "12px", lineHeight: 1.5 },
  readMore: {
    fontSize: "0.92rem",
    color: "#0a5397",
    fontWeight: 600,
    textDecoration: "none",
  },
  pagination: { marginTop: "32px", display: "flex", justifyContent: "center", gap: "10px", alignItems: "center" },
  pageButton: {
    backgroundColor: "#f3f4f6",
    color: "#111827",
    border: "1px solid #d1d5db",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "0.9rem",
  },
  activePage: { backgroundColor: "#0a5397", color: "#fff", border: "1px solid #0a5397" },
  navButton: {
    backgroundColor: "#f3f4f6",
    color: "#111827",
    border: "none",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    cursor: "pointer",
    fontWeight: 600,
  },
  disabled: { opacity: 0.4, cursor: "not-allowed" },
};

const SinhalaCourses: React.FC = () => {
  // use the sample data (filter just the sinhala ones)
  const sinhalaCourses = sinhalaCoursesData.filter((c) => c.category === "sinhala");

  // pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const eventsPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(sinhalaCourses.length / eventsPerPage));
  const indexOfLast = currentPage * eventsPerPage;
  const indexOfFirst = indexOfLast - eventsPerPage;
  const currentCourses = sinhalaCourses.slice(indexOfFirst, indexOfLast);

  // parallax ref
  const circleRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let instance: any = null;
    if (typeof window !== "undefined" && circleRef.current) {
      (async () => {
        try {
          const mod = await import("rellax");
          const Rellax = mod?.default || mod;
          instance = new Rellax(circleRef.current, { speed: -3, center: false, round: true });
        } catch {
          // no-op if rellax isn't installed
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
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <section style={styles.sectionWrapper}>
      <div ref={circleRef} style={styles.backgroundCircle} />

      <div style={styles.container}>
        <h1 style={styles.title}>Sinhala Courses</h1>
        <h2 style={styles.subtitle}>Popular Sinhala Programs & Classes</h2>

        <div style={styles.grid}>
          {currentCourses.map((course) => (
            <Link
              key={course.id}
              to={`/course/${slugify(course.id || course.title)}`}
              style={{ textDecoration: "none" }}
            >
              <article
                style={styles.card}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 24px rgba(0,0,0,0.12)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "none";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(0,0,0,0.08)";
                }}
              >
                <img src={course.image} alt={course.title} style={styles.image} loading="lazy" />
                <div style={styles.info}>
                  <div>
                    <h3 style={styles.eventName}>{course.title}</h3>
                    <div style={styles.date}>
                      {course.instructor} • {course.duration}
                    </div>
                    <p style={styles.description}>{course.description}</p>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontWeight: 800, color: "#0a5397" }}>{course.price}</div>
                    <span style={styles.readMore}>View course →</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div style={styles.pagination}>
          <button
            style={{ ...(styles.navButton as CSSProperties), ...(currentPage === 1 ? styles.disabled : {}) }}
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="previous page"
          >
            ‹
          </button>

          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                style={{ ...(styles.pageButton as CSSProperties), ...(currentPage === page ? styles.activePage : {}) }}
                onClick={() => goToPage(page)}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </button>
            );
          })}

          <button
            style={{ ...(styles.navButton as CSSProperties), ...(currentPage === totalPages ? styles.disabled : {}) }}
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="next page"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
};

export default SinhalaCourses;
