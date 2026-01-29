import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowRight, Play, Star, Users, BookOpen, Award } from 'lucide-react';

const Hero = () => {
  const heroRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Headline animation
      gsap.fromTo(
        '.headline-line',
        { opacity: 0, y: 30, clipPath: 'inset(100% 0 0 0)' },
        {
          opacity: 1,
          y: 0,
          clipPath: 'inset(0% 0 0 0)',
          duration: 0.8,
          stagger: 0.12,
          ease: 'expo.out',
          delay: 0.4,
        }
      );

      // Subheadline animation
      gsap.fromTo(
        '.subheadline',
        { opacity: 0, filter: 'blur(10px)' },
        {
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.6,
          ease: 'power2.out',
          delay: 0.9,
        }
      );

      // CTA buttons animation
      gsap.fromTo(
        '.cta-button',
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: 'back.out(1.7)',
          delay: 1.1,
        }
      );

      // Hero image animation
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, x: 100, rotateY: 25 },
        {
          opacity: 1,
          x: 0,
          rotateY: 0,
          duration: 1.2,
          ease: 'expo.out',
          delay: 0.3,
        }
      );

      // Stats animation
      gsap.fromTo(
        '.stat-item',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'expo.out',
          delay: 1.4,
        }
      );

      // Badge animation
      gsap.fromTo(
        badgeRef.current,
        { opacity: 0, scale: 0, rotation: -360 },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.8,
          ease: 'back.out(1.7)',
          delay: 1.6,
        }
      );

      // Parallax effect on scroll
      gsap.to('.headline-line', {
        y: -80,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      gsap.to(imageRef.current, {
        y: -40,
        scale: 1.05,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen w-full overflow-hidden bg-white pt-20"
    >
      {/* Gradient mesh background */}
      <div className="absolute inset-0 gradient-mesh opacity-30" />

      {/* Diagonal accent */}
      <div
        className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-br from-trainex-orange/5 to-transparent"
        style={{ clipPath: 'polygon(0 0, 70% 0, 50% 100%, 0 100%)' }}
      />

      <div className="relative w-full px-4 sm:px-6 lg:px-12 xl:px-20 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[calc(100vh-160px)]">
          {/* Content */}
          <div className="relative z-10 max-w-2xl">
            <div ref={headlineRef} className="mb-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold text-black leading-tight">
                <span className="headline-line block">Unlock Your</span>
                <span className="headline-line block">Potential With</span>
                <span className="headline-line block text-gradient">Expert Training</span>
              </h1>
            </div>

            <p className="subheadline text-lg sm:text-xl text-trainex-gray mb-8 max-w-lg leading-relaxed">
              Transform your career with industry-leading courses designed by experts. 
              Join 50,000+ professionals who've accelerated their growth.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <button
                onClick={() => scrollToSection('#courses')}
                className="cta-button btn-primary group"
              >
                Explore Courses
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" />
              </button>
              <button
                onClick={() => scrollToSection('#video')}
                className="cta-button btn-secondary group"
              >
                <Play className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div ref={statsRef} className="flex flex-wrap gap-8">
              <div className="stat-item flex items-center gap-3">
                <div className="w-12 h-12 bg-trainex-orange/10 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-trainex-orange" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-black">500+</p>
                  <p className="text-sm text-trainex-gray">Courses</p>
                </div>
              </div>
              <div className="stat-item flex items-center gap-3">
                <div className="w-12 h-12 bg-trainex-orange/10 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-trainex-orange" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-black">50K+</p>
                  <p className="text-sm text-trainex-gray">Students</p>
                </div>
              </div>
              <div className="stat-item flex items-center gap-3">
                <div className="w-12 h-12 bg-trainex-orange/10 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-trainex-orange" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-black">98%</p>
                  <p className="text-sm text-trainex-gray">Satisfaction</p>
                </div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative lg:pl-8">
            <div
              ref={imageRef}
              className="relative rounded-3xl overflow-hidden shadow-2xl"
              style={{ perspective: '1200px' }}
            >
              <img
                src="/hero-image.jpg"
                alt="Professional training"
                className="w-full h-auto object-cover"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Rotating badge */}
            <div
              ref={badgeRef}
              className="absolute -bottom-6 -left-6 w-24 h-24 bg-trainex-orange rounded-full flex items-center justify-center shadow-lg"
            >
              <div className="animate-spin-slow text-center">
                <Star className="w-8 h-8 text-white mx-auto mb-1" />
                <span className="text-white text-xs font-bold">Since 2010</span>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-trainex-bg-gray rounded-2xl flex items-center justify-center shadow-lg animate-float">
              <span className="text-2xl">🎯</span>
            </div>
            <div className="absolute top-1/2 -right-8 w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg animate-float" style={{ animationDelay: '2s' }}>
              <span className="text-xl">📚</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="#f3f3f3"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
