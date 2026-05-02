import { useState, useEffect } from "react";
import { fetchContent } from "../utils/contentLoader.js";
import Tittle from "../components/atoms/Tittle";
import Description from "../components/atoms/Description";
import Tagline from "../components/atoms/Tagline";

export default function Galeri() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("semua");

  useEffect(() => {
    const loadGaleri = async () => {
      const data = await fetchContent("galeri");
      setPhotos(data);
      setLoading(false);
    };
    loadGaleri();
  }, []);

  // Ambil semua kategori unik
  const categories = ["semua", ...new Set(photos.map((p) => p.kategori).filter(Boolean))];

  const filtered =
    filter === "semua" ? photos : photos.filter((p) => p.kategori === filter);

  const resolveImage = (img) => {
    if (!img) return null;
    if (img.startsWith("/") || img.startsWith("http")) return img;
    return null;
  };

  return (
    <section
      id="galeri"
      className="relative bg-white py-16 lg:py-24 px-6 lg:px-20 overflow-hidden min-h-screen"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-green-light opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-200 opacity-10 rounded-full blur-2xl"></div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeSlideUp">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-green-light/20 rounded-full border border-primary-200/30 mb-6">
            <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium text-primary-700">Dokumentasi</span>
          </div>
          <Tittle>Galeri Foto</Tittle>
          <Description>Momen-momen berharga dari kegiatan Dewan Ambalan</Description>
        </div>

        {/* Filter Kategori */}
        {categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 capitalize ${
                  filter === cat
                    ? "bg-gradient-green text-white shadow-green"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="w-10 h-10 border-4 border-primary-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-lg">Belum ada foto di galeri.</p>
            <p className="text-sm mt-1">Tambahkan foto melalui CMS.</p>
          </div>
        )}

        {/* Grid Foto */}
        {!loading && filtered.length > 0 && (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {filtered.map((photo, index) => (
              <div
                key={photo.slug || index}
                className="break-inside-avoid group cursor-pointer"
                onClick={() => setSelected(photo)}
              >
                <div className="relative overflow-hidden rounded-2xl shadow-soft group-hover:shadow-medium transition-all duration-400">
                  <img
                    src={resolveImage(photo.image)}
                    alt={photo.title || "Foto galeri"}
                    className="w-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-2xl">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      {photo.title && (
                        <p className="text-white font-semibold text-sm leading-tight">{photo.title}</p>
                      )}
                      {photo.kategori && (
                        <span className="text-white/70 text-xs capitalize">{photo.kategori}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={resolveImage(selected.image)}
              alt={selected.title}
              className="w-full max-h-[80vh] object-contain rounded-2xl"
            />
            {(selected.title || selected.description) && (
              <div className="mt-4 text-center text-white">
                {selected.title && <p className="font-semibold text-lg">{selected.title}</p>}
                {selected.description && <p className="text-white/70 text-sm mt-1">{selected.description}</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
