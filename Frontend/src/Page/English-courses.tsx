import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { CSSProperties } from "react";

/**
 * English Courses Page
 *
 * - Lists only English courses (sample data included)
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

// Sample English courses — replace with your real data
const englishCoursesData: Course[] = [
  {
    id: "english-communication",
    title: "English Communication Mastery",
    instructor: "Ms. Sarah Johnson",
    price: "LKR 4,999",
    duration: "4 months",
    image:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1600&q=80",
    description:
      "Improve speaking, listening and professional writing with practical exercises and live practice sessions.",
    category: "english",
  },
  {
    id: "english-business",
    title: "Business English",
    instructor: "Mr. Arjun",
    price: "LKR 5,499",
    duration: "4 months",
    image:
      "https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&w=1600&q=80",
    description: "Professional English for meetings, presentations and writing.",
    category: "english",
  },
  {
    id: "english-academic",
    title: "Academic English & Essay Writing",
    instructor: "Dr. Meera",
    price: "LKR 4,299",
    duration: "3 months",
    image:
      "https://images.unsplash.com/photo-1496317899792-9d7dbcd928a1?auto=format&fit=crop&w=1600&q=80",
    description: "Structure essays, improve academic vocabulary and research writing skills.",
    category: "english",
  },
  {
    id: "english-kids",
    title: "English for Kids",
    instructor: "Miss Emily",
    price: "LKR 2,199",
    duration: "8 weeks",
    image:
      "https://images.unsplash.com/photo-1496080174650-637e3f22fa03?auto=format&fit=crop&w=1600&q=80",
    description: "Fun lessons to build early reading, speaking and listening skills.",
    category: "english",
  },
  {
    id: "english-interview",
    title: "Interview & Presentation Skills",
    instructor: "Mr. Ravi",
    price: "LKR 3,499",
    duration: "6 weeks",
    image:
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1600&q=80",
    description: "Build confidence, answer questions clearly and present professionally.",
    category: "english",
  },
  {
    id: "english-ielts",
    title: "IELTS Preparation",
    instructor: "Ms. Priya",
    price: "LKR 7,499",
    duration: "8 weeks",
    image:
      "https://images.unsplash.com/photo-1514689072236-3a4d0a3d7b1f?auto=format&fit=crop&w=1600&q=80",
    description: "Focused practice for all four IELTS skills with mock tests and feedback.",
    category: "english",
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

// styles (same look as your previous pages)
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

const EnglishCourses: React.FC = () => {
  // use the sample data (filter just the english ones)
  const englishCourses = englishCoursesData.filter((c) => c.category === "english");

  // pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const coursesPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(englishCourses.length / coursesPerPage));
  const indexOfLast = currentPage * coursesPerPage;
  const indexOfFirst = indexOfLast - coursesPerPage;
  const currentCourses = englishCourses.slice(indexOfFirst, indexOfLast);

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
        <h1 style={styles.title}>English Courses</h1>
        <h2 style={styles.subtitle}>Popular English Programs & Classes</h2>

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

export default EnglishCourses;
