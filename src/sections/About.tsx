import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Users, BookOpen, Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const statsCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section label typewriter effect
      gsap.fromTo(
        '.about-label',
        { opacity: 0, width: 0 },
        {
          opacity: 1,
          width: 'auto',
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      );

      // Left border animation
      gsap.fromTo(
        '.about-border',
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 0.8,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      );

      // Headline word animation
      gsap.fromTo(
        '.about-headline span',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            once: true,
          },
        }
      );

      // Body text animation
      gsap.fromTo(
        '.about-text',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            once: true,
          },
        }
      );

      // CTA button animation
      gsap.fromTo(
        '.about-cta',
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 65%',
            once: true,
          },
        }
      );

      // Image animation
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, scale: 1.1, clipPath: 'inset(100% 0 0 0)' },
        {
          opacity: 1,
          scale: 1,
          clipPath: 'inset(0% 0 0 0)',
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            once: true,
          },
        }
      );

      // Stats card animation
      gsap.fromTo(
        statsCardRef.current,
        { opacity: 0, y: 60, rotateX: 10 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.8,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            once: true,
          },
        }
      );

      // Parallax effects
      gsap.to(imageRef.current, {
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });

      gsap.to(statsCardRef.current, {
        y: 20,
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

  const stats = [
    { icon: Users, value: '25K+', label: 'Active Students' },
    { icon: BookOpen, value: '500+', label: 'Expert Courses' },
    { icon: Star, value: '4.9', label: 'Average Rating' },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full py-20 lg:py-32 bg-trainex-bg-gray overflow-hidden"
    >
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div className="relative">
            {/* Left border accent */}
            <div className="about-border absolute -left-6 top-0 w-1 h-full bg-trainex-orange origin-top" />

            <span className="about-label section-label">About Us</span>

            <h2 className="about-headline section-title mb-6">
              {'Empowering Learners Worldwide Since 2010'.split(' ').map((word, i) => (
                <span key={i} className="inline-block mr-3">
                  {word}
                </span>
              ))}
            </h2>

            <p className="about-text section-description mb-4">
              We've helped over 50,000 professionals transform their careers through 
              innovative, practical training. Our expert-led courses combine cutting-edge 
              theory with real-world application.
            </p>

            <p className="about-text section-description mb-8">
              Whether you're looking to upskill, switch careers, or advance in your current 
              role, Trainex provides the tools, resources, and support you need to succeed 
              in today's competitive job market.
            </p>

            <button
              onClick={() => document.querySelector('#courses')?.scrollIntoView({ behavior: 'smooth' })}
              className="about-cta btn-primary group"
            >
              Learn More About Us
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" />
            </button>
          </div>

          {/* Image with stats card */}
          <div className="relative">
            <div
              ref={imageRef}
              className="relative rounded-3xl overflow-hidden shadow-xl"
            >
              <img
                src="/about-image.jpg"
                alt="About Trainex"
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Stats card */}
            <div
              ref={statsCardRef}
              className="absolute -bottom-8 -left-8 bg-white rounded-2xl shadow-card-hover p-6 max-w-xs"
              style={{ perspective: '1000px' }}
            >
              <div className="grid grid-cols-3 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="w-10 h-10 bg-trainex-orange/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <stat.icon className="w-5 h-5 text-trainex-orange" />
                    </div>
                    <p className="text-xl font-bold text-trainex-black">{stat.value}</p>
                    <p className="text-xs text-trainex-gray">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Decorative element */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-trainex-orange/10 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
