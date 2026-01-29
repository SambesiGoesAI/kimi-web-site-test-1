import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Play, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Video = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background fade in
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      );

      // Headline animation
      gsap.fromTo(
        '.video-headline',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            once: true,
          },
        }
      );

      // Subtext animation
      gsap.fromTo(
        '.video-subtext',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            once: true,
          },
        }
      );

      // Video container animation
      gsap.fromTo(
        videoContainerRef.current,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 65%',
            once: true,
          },
        }
      );

      // Play button animation
      gsap.fromTo(
        '.play-button',
        { opacity: 0, scale: 0, rotation: -180 },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.6,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            once: true,
          },
        }
      );

      // Scale effect on scroll
      gsap.to(videoContainerRef.current, {
        scale: 1.02,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="video"
      ref={sectionRef}
      className="relative w-full py-20 lg:py-32 bg-trainex-black overflow-hidden"
    >
      {/* Particle background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-trainex-orange/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${8 + Math.random() * 8}s`,
            }}
          />
        ))}
      </div>

      {/* Curved top edge */}
      <div className="absolute top-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <path
            d="M0 0L60 10C120 20 240 40 360 45C480 50 600 50 720 45C840 40 960 30 1080 25C1200 20 1320 20 1380 20L1440 20V0H1380C1320 0 1200 0 1080 0C960 0 840 0 720 0C600 0 480 0 360 0C240 0 120 0 60 0H0Z"
            fill="#ece2d0"
          />
        </svg>
      </div>

      <div className="relative w-full px-4 sm:px-6 lg:px-12 xl:px-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="video-headline text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-4">
            See How We Transform Careers
          </h2>
          <p className="video-subtext text-lg text-trainex-light-gray">
            Watch our students share their success stories
          </p>
        </div>

        {/* Video Container */}
        <div
          ref={videoContainerRef}
          className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Thumbnail */}
          <div className="relative aspect-video">
            <img
              src="/cta-image.jpg"
              alt="Video thumbnail"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-trainex-black/40" />

            {/* Play button */}
            <button
              onClick={() => setIsPlaying(true)}
              className="play-button absolute inset-0 flex items-center justify-center group"
            >
              <div className="relative">
                {/* Pulse rings */}
                <div className="absolute inset-0 w-24 h-24 bg-trainex-orange/30 rounded-full animate-ping" />
                <div className="absolute inset-0 w-24 h-24 bg-trainex-orange/20 rounded-full animate-pulse" />
                
                {/* Button */}
                <div className="relative w-24 h-24 bg-trainex-orange rounded-full flex items-center justify-center shadow-glow transition-all duration-300 group-hover:scale-110 group-hover:shadow-glow-lg">
                  <Play className="w-10 h-10 text-white fill-white ml-1" />
                </div>
              </div>
            </button>

            {/* Border glow */}
            <div className="absolute inset-0 rounded-3xl border-2 border-trainex-orange/0 transition-all duration-500 group-hover:border-trainex-orange/50 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Curved bottom edge */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <path
            d="M0 60L60 50C120 40 240 20 360 15C480 10 600 10 720 15C840 20 960 30 1080 35C1200 40 1320 40 1380 40L1440 40V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z"
            fill="#ece2d0"
          />
        </svg>
      </div>

      {/* Video Modal */}
      {isPlaying && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-trainex-black/90 backdrop-blur-sm"
          onClick={() => setIsPlaying(false)}
        >
          <div className="relative w-full max-w-5xl mx-4">
            <button
              onClick={() => setIsPlaying(false)}
              className="absolute -top-12 right-0 text-white hover:text-trainex-orange transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="aspect-video bg-trainex-black rounded-2xl overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/KGg5cIjHQiw?autoplay=1"
                title="Trainex Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Video;
