// src/pages/EnglishCourses.tsx
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import type { CSSProperties } from "react";

type Course = {
  id: string;
  title: string;
  price?: string;
  duration?: string;
  image: string;
  description: string;
  category?: string;
  mainHeadings?: string[];
  coursedemovideolink?: string;
  courseCategory?: string;
};

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

// Short description helper
const shortText = (text: string, max: number = 120) =>
  text && text.length > max ? text.substring(0, max) + "..." : text;

// styles (unchanged)
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
  description: {
    fontSize: "0.95rem",
    color: "#374151",
    marginBottom: "12px",
    lineHeight: 1.5,
  },
  readMore: {
    fontSize: "0.92rem",
    color: "#0a5397",
    fontWeight: 600,
    textDecoration: "none",
  },
  pagination: {
    marginTop: "32px",
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    alignItems: "center",
  },
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
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const eventsPerPage = 6;

  const circleRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let instance: any = null;
    if (typeof window !== "undefined" && circleRef.current) {
      (async () => {
        try {
          const mod = await import("rellax");
          const Rellax = mod?.default || mod;
          instance = new Rellax(circleRef.current, { speed: -3, center: false, round: true });
        } catch {}
      })();
    }
    return () => {
      if (instance?.destroy) instance.destroy();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);

      try {
        const resp = await axios.get(`${import.meta.env.VITE_API_HOST}/Couressection`);

        const rawItems: any[] = Array.isArray(resp.data)
          ? resp.data
          : Array.isArray(resp.data?.data)
          ? resp.data.data
          : [];

        const mapped: Course[] = rawItems
          .map((item: any, idx: number) => {
            const courseCategory = (item.courseCategory ?? item.category ?? item.course_category ?? "").toString();
            return {
              id: (item.id ?? item._id ?? item.courseId ?? `course-${idx}`).toString(),
              title: item.courseName ?? item.courseTitle ?? item.title ?? "Untitled course",
              price: item.coursePrice ?? item.price ?? "",
              duration: item.duration ?? "—",
              image:
                item.courseImage ??
                item.image ??
                "https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1600&q=80",
              description: item.courseDescription ?? item.description ?? "",
              category: courseCategory,
              mainHeadings: Array.isArray(item.mainHeadings)
                ? item.mainHeadings
                : item.mainHeadings
                ? [item.mainHeadings]
                : [],
              coursedemovideolink: item.coursedemovideolink,
              courseCategory,
            };
          })
          // 🔥 SHOW ENGLISH COURSES ONLY
          .filter((c: Course) => (c.courseCategory ?? "").toLowerCase() === "english");

        if (!cancelled) setCourses(mapped);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        if (!cancelled) setError("Failed to load courses. Please try again later.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const totalPages = Math.max(1, Math.ceil(courses.length / eventsPerPage));
  const indexOfLast = currentPage * eventsPerPage;
  const indexOfFirst = indexOfLast - eventsPerPage;
  const currentCourses = courses.slice(indexOfFirst, indexOfLast);

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

        {loading ? (
          <div style={{ marginBottom: 20, color: "#374151" }}>Loading courses…</div>
        ) : error ? (
          <div style={{ marginBottom: 20, color: "crimson" }}>{error}</div>
        ) : courses.length === 0 ? (
          <div style={{ marginBottom: 20, color: "#374151" }}>No English courses available.</div>
        ) : null}

        <div style={styles.grid}>
          {currentCourses.map((course) => (
            <Link
              key={course.id}
              to={`/course/${slugify(course.id || course.title)}`}
              style={{ textDecoration: "none" }}
              aria-label={`Open course ${course.title}`}
            >
              <article
                style={styles.card}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "translateY(-6px)";
                  el.style.boxShadow = "0 12px 24px rgba(0,0,0,0.12)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "none";
                  el.style.boxShadow = "0 6px 20px rgba(0,0,0,0.08)";
                }}
              >
                <img src={course.image} alt={course.title} style={styles.image} loading="lazy" />
                <div style={styles.info}>
                  <div>
                    <h3 style={styles.eventName}>{course.title}</h3>
                    <div style={styles.date}>Duration : {course.duration} Week</div>

                    <p style={styles.description}>{shortText(course.description)}</p>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    
                    <div
                      style={{
                        fontWeight: 800,
                        color: "#0a5397",
                        fontSize: "0.85rem",
                      }}
                    >
                      {course.price ? `LKR ${course.price}` : "LKR —"}
                    </div>

                    <span style={styles.readMore}>View course →</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

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
            style={{
              ...(styles.navButton as CSSProperties),
              ...(currentPage === totalPages ? styles.disabled : {}),
            }}
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
