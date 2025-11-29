import React, { useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

type SlideItem = {
  id?: string | number;
  slidername?: string;
  sliderimagelink: string;
};

const FALLBACK_SLIDES: SlideItem[] = [
  { sliderimagelink: "https://i.ibb.co/GQMJbGYt/experience-excellence-lyceum-campus.webp" },
  { sliderimagelink: "https://i.ibb.co/v45mkW4w/teacher-training-diploma-programme-lyceum-campus.webp" },
  { sliderimagelink: "https://i.ibb.co/0pGrR4Nx/pearson-level-5-hnd-in-business-lyceum-campus.webp" },
  { sliderimagelink: "https://i.ibb.co/ksK3KbqW/pearson-btec-hnd-level-5-computing-lyceum-campus.webp" },
  { sliderimagelink: "https://i.ibb.co/9kWyfsJQ/bed-hons-primary-education-programme-lyceum-campus.webp" },
  { sliderimagelink: "https://i.ibb.co/9zKQZdw/deakin-pathway-programme-lyceum-campus-1.webp" },
];

function Slider() {
  const [slides, setSlides] = useState<SlideItem[]>(FALLBACK_SLIDES);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleSelect = (selectedIndex: number) => setActiveIndex(selectedIndex);

  // Fetch slider images from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_HOST}/Slidersection`
        );

        if (Array.isArray(response.data) && response.data.length > 0) {
          setSlides(response.data); // Uses slidername + sliderimagelink
        }
      } catch (err) {
        console.error("Error fetching data: ", err);
        setError("Failed to load slider images.");
      } finally {
        setTimeout(() => setLoading(false), 300);
      }
    };

    fetchData();
  }, []);

  // Custom arrow background circle
  const arrowWrapperStyle = {
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const arrowIconStyle = {
    width: "25px",
    height: "25px",
    fill: "#fff",
  };

  const PrevArrow = (
    <div style={arrowWrapperStyle}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={arrowIconStyle}>
        <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z" />
      </svg>
    </div>
  );

  const NextArrow = (
    <div style={arrowWrapperStyle}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={arrowIconStyle}>
        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
      </svg>
    </div>
  );

  if (loading) return <p>Loading slider...</p>;

  return (
    <Carousel
      activeIndex={activeIndex}
      onSelect={handleSelect}
      interval={3000}
      pause="hover"
      nextIcon={NextArrow}
      prevIcon={PrevArrow}
      indicators={true}
    >
      {slides.map((slide, index) => (
        <Carousel.Item key={slide.id || index}>
          <img
            className="d-block w-100"
            src={slide.sliderimagelink}
            alt={slide.slidername || `slide-${index}`}
            style={{ objectFit: "cover" }}
          />
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default Slider;
