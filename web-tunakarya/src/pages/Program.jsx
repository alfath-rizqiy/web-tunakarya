import { useState, useEffect } from "react";
import Description from "../components/atoms/Description";
import Tittle from "../components/atoms/Tittle";
import Subtitle from "../components/atoms/Subtitle";
import Tagline from "../components/atoms/Tagline";
import Score from "../components/atoms/Score";
import { fetchContent } from "../utils/contentLoader.js";
import defaultImg from "../assets/images/perlak.jpeg";

export default function Program() {
  const [programs, setPrograms] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPrograms = async () => {
      const data = await fetchContent("program");
      if (data.length > 0) {
        setPrograms(data);
      } else {
        // Fallback jika belum ada konten di CMS
        setPrograms([
          {
            title: "Program Kami",
            description: "Belum ada program yang ditambahkan.",
            image: defaultImg,
            order: 1,
          },
        ]);
      }
      setLoading(false);
    };
    loadPrograms();
  }, []);

  const current = programs[page] || {};

  const handleNext = () => {
    setPage((prev) => (prev === programs.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setPage((prev) => (prev === 0 ? programs.length - 1 : prev - 1));
  };

  // Resolve image: bisa dari /uploads (CMS) atau fallback ke asset lokal
  const resolveImage = (img) => {
    if (!img) return defaultImg;
    if (img.startsWith('/') || img.startsWith('http')) return img;
    return defaultImg;
  };

  return (
    <section
      id="program"
      className="relative bg-white py-16 lg:py-24 px-6 lg:px-20 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-gradient-green-light opacity-10 rounded-full blur-3xl -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary-200 opacity-10 rounded-full blur-2xl"></div>

      <div className="relative max-w-7xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-10 h-10 border-4 border-primary-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            {/* Image Gallery */}
            <div className="space-y-6 animate-fadeSlideIn">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-green opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-400"></div>
                <div className="aspect-[7/4] overflow-hidden rounded-3xl shadow-soft group-hover:shadow-medium transition-all duration-400">
                  <img
                    src={resolveImage(current.image)}
                    alt={current.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>

              {/* Image indicators */}
              {programs.length > 1 && (
                <div className="flex justify-center gap-2">
                  {programs.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setPage(index)}
                      className={`h-2 rounded-full transition-all duration-400 ${
                        index === page
                          ? "w-8 bg-gradient-green"
                          : "w-2 bg-gray-300 hover:bg-gray-400"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="space-y-8 animate-fadeSlideUp">
              <div className="space-y-4">
                <Tagline>Program Kami</Tagline>
                <div className="flex justify-between items-start">
                  <div>
                    <Tittle>{current.title}</Tittle>
                    {current.subtitle && <Subtitle>{current.subtitle}</Subtitle>}
                  </div>
                  {programs.length > 1 && (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handlePrev}
                        className="w-12 h-12 bg-white rounded-full shadow-soft flex items-center justify-center text-gray-700 hover:bg-gradient-green hover:text-white hover:shadow-green transition-all duration-400 transform hover:scale-110"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={handleNext}
                        className="w-12 h-12 bg-white rounded-full shadow-soft flex items-center justify-center text-gray-700 hover:bg-gradient-green hover:text-white hover:shadow-green transition-all duration-400 transform hover:scale-110"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <Description style="justify">
                {current.description || current.body || ""}
              </Description>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
