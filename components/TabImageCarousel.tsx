"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const AUTOPLAY_DELAY = 4000;

export type TabImageCarouselImage = {
  src: string;
  alt: string;
  position?: string;
};

type TabImageCarouselProps = {
  images: TabImageCarouselImage[];
  className?: string;
};

export default function TabImageCarousel({
  images,
  className = "",
}: TabImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (images.length <= 1 || isPaused) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let timeoutId: number | undefined;

    const clearTimer = () => {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };

    const scheduleNextSlide = () => {
      clearTimer();

      if (reducedMotion.matches) return;

      timeoutId = window.setTimeout(() => {
        setActiveIndex((current) => (current + 1) % images.length);
      }, AUTOPLAY_DELAY);
    };

    scheduleNextSlide();
    reducedMotion.addEventListener("change", scheduleNextSlide);

    return () => {
      clearTimer();
      reducedMotion.removeEventListener("change", scheduleNextSlide);
    };
  }, [activeIndex, images.length, isPaused]);

  if (images.length === 0) return null;

  return (
    <div
      aria-label="Galería del Premium Box"
      aria-roledescription="carrusel"
      className={`absolute inset-0 ${className}`}
      role="region"
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsPaused(false);
        }
      }}
      onFocusCapture={() => setIsPaused(true)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {images.map((image, index) => {
        const isActive = index === activeIndex;

        return (
          <div
            key={`${image.src}-${index}`}
            aria-hidden={!isActive}
            className={`absolute inset-0 overflow-hidden bg-negro transition-opacity duration-700 ease-out motion-reduce:transition-none ${
              isActive ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={image.src}
              alt=""
              aria-hidden="true"
              fill
              sizes="(min-width: 1152px) 622px, (min-width: 768px) 54vw, 100vw"
              className={`scale-110 object-cover opacity-60 blur-2xl ${
                image.position ?? "object-center"
              }`}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-negro/25"
            />
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 1152px) 622px, (min-width: 768px) 54vw, 100vw"
              className="object-contain"
            />
          </div>
        );
      })}

      {images.length > 1 && (
        <div className="absolute bottom-3 left-3 z-20 flex items-center sm:bottom-4 sm:left-4">
          {images.map((image, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={image.src}
                aria-label={`Mostrar imagen ${index + 1} de ${images.length}: ${image.alt}`}
                aria-pressed={isActive}
                className="group grid h-8 w-8 place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/60"
                type="button"
                onClick={() => setActiveIndex(index)}
              >
                <span
                  aria-hidden="true"
                  className={`h-1.5 rounded-full transition-all duration-300 motion-reduce:transition-none ${
                    isActive
                      ? "w-5 bg-white"
                      : "w-1.5 bg-white/55 group-hover:bg-white/80"
                  }`}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
