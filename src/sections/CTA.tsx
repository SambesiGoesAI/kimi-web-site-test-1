import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, MessageCircle, Shield, Infinity } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const CTA = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Left background wipe
      gsap.fromTo(
        leftRef.current,
        { clipPath: 'inset(0 100% 0 0)' },
        {
          clipPath: 'inset(0 0% 0 0)',
          duration: 0.8,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      );

      // Right background wipe
      gsap.fromTo(
        rightRef.current,
        { clipPath: 'inset(0 0 0 100%)' },
        {
          clipPath: 'inset(0 0 0 0%)',
          duration: 0.8,
          ease: 'expo.out',
          delay: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      );

      // Headline word reveal
      gsap.fromTo(
        '.cta-headline span',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            once: true,
          },
        }
      );

      // Body text animation
      gsap.fromTo(
        '.cta-text',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 65%',
            once: true,
          },
        }
      );

      // CTA buttons animation
      gsap.fromTo(
        '.cta-button-primary',
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        '.cta-button-secondary',
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.4,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 58%',
            once: true,
          },
        }
      );

      // Trust badges animation
      gsap.fromTo(
        '.trust-badge',
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 55%',
            once: true,
          },
        }
      );

      // Parallax effects
      gsap.to(rightRef.current, {
        y: -30,
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

  const trustBadges = [
    { icon: Shield, text: '30-Day Money Back' },
    { icon: Infinity, text: 'Lifetime Access' },
    { icon: MessageCircle, text: 'Expert Support' },
  ];

  return (
    <section
      id="cta"
      ref={sectionRef}
      className="relative w-full py-20 lg:py-32 overflow-hidden"
    >
      <div className="grid lg:grid-cols-2 min-h-[500px]">
        {/* Left side - Content */}
        <div
          ref={leftRef}
          className="relative bg-trainex-bg-gray py-12 lg:py-20 px-4 sm:px-6 lg:px-12 xl:px-20 flex items-center"
        >
          <div className="max-w-xl">
            <h2 className="cta-headline text-3xl sm:text-4xl lg:text-5xl font-semibold text-trainex-black mb-6 leading-tight">
              {'Ready to Start Your Learning Journey?'.split(' ').map((word, i) => (
                <span key={i} className="inline-block mr-2">
                  {word}
                </span>
              ))}
            </h2>

            <p className="cta-text text-lg text-trainex-gray mb-8 leading-relaxed">
              Join thousands of successful professionals who've transformed their careers 
              with Trainex. Get unlimited access to 500+ courses taught by industry experts.
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <button
                onClick={() => document.querySelector('#courses')?.scrollIntoView({ behavior: 'smooth' })}
                className="cta-button-primary btn-primary group animate-pulse-glow"
              >
                Get Started Today
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" />
              </button>
              <button
                onClick={() => document.querySelector('#footer')?.scrollIntoView({ behavior: 'smooth' })}
                className="cta-button-secondary btn-secondary group"
              >
                Contact Us
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4">
              {trustBadges.map((badge, index) => (
                <div
                  key={index}
                  className="trust-badge flex items-center gap-2 text-sm text-trainex-gray"
                >
                  <div className="w-8 h-8 bg-trainex-orange/10 rounded-lg flex items-center justify-center">
                    <badge.icon className="w-4 h-4 text-trainex-orange" />
                  </div>
                  <span>{badge.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side - Image */}
        <div
          ref={rightRef}
          className="relative hidden lg:block"
        >
          <div className="absolute inset-0">
            <img
              src="/cta-image.jpg"
              alt="Join Trainex"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-trainex-black/40" />
          </div>

          {/* Diagonal divider */}
          <div
            className="absolute top-0 left-0 w-20 h-full bg-trainex-white"
            style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
          />
        </div>
      </div>
    </section>
  );
};

export default CTA;
