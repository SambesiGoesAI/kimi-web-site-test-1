import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star, Quote } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  course: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Amanda Reed',
    role: 'Developer',
    content: 'The web development bootcamp completely changed my career trajectory. I went from zero coding experience to a full-time developer job in 6 months.',
    rating: 5,
    course: 'Web Development Bootcamp',
    avatar: '/avatar-1.jpg',
  },
  {
    id: 2,
    name: 'Louis Ferguson',
    role: 'Designer',
    content: 'The UI/UX masterclass taught me to think like a designer. The practical projects gave me a portfolio that landed me my dream job.',
    rating: 5,
    course: 'UI/UX Design Masterclass',
    avatar: '/avatar-2.jpg',
  },
  {
    id: 3,
    name: 'Joan Wallace',
    role: 'Data Scientist',
    content: 'Dr. Roberts made complex data science concepts accessible. The course structure and support were exceptional.',
    rating: 5,
    course: 'Data Science Fundamentals',
    avatar: '/avatar-3.jpg',
  },
  {
    id: 4,
    name: 'Carolyn Ortiz',
    role: 'Marketing Manager',
    content: 'The digital marketing strategy course gave me the framework to double our company\'s online presence in just 3 months.',
    rating: 5,
    course: 'Digital Marketing Strategy',
    avatar: '/avatar-4.jpg',
  },
  {
    id: 5,
    name: 'Billy Vasquez',
    role: 'Team Lead',
    content: 'The leadership course helped me transform my management style. My team engagement scores improved by 40%.',
    rating: 5,
    course: 'Business Leadership',
    avatar: '/avatar-5.jpg',
  },
  {
    id: 6,
    name: 'Larry Lawson',
    role: 'Photographer',
    content: 'From amateur to professional in 12 weeks. The photography essentials course covered everything I needed to start my business.',
    rating: 5,
    course: 'Photography Essentials',
    avatar: '/avatar-6.jpg',
  },
];

const Testimonials = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        '.testimonials-header > *',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      );

      // Cards float in animation
      gsap.fromTo(
        '.testimonial-card',
        { opacity: 0, y: 60, rotation: (i) => (i % 2 === 0 ? -5 : 5) },
        {
          opacity: 1,
          y: 0,
          rotation: (i) => (i % 2 === 0 ? -2 : 2),
          duration: 0.7,
          stagger: 0.1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: '.testimonials-grid',
            start: 'top 80%',
            once: true,
          },
        }
      );

      // Quote icons spin in
      gsap.fromTo(
        '.quote-icon',
        { opacity: 0, scale: 0, rotation: -180 },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: '.testimonials-grid',
            start: 'top 70%',
            once: true,
          },
        }
      );

      // Avatar pop in
      gsap.fromTo(
        '.testimonial-avatar',
        { opacity: 0, scale: 0 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          stagger: 0.1,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: '.testimonials-grid',
            start: 'top 65%',
            once: true,
          },
        }
      );

      // Parallax effects
      gsap.utils.toArray<HTMLElement>('.testimonial-card').forEach((card, i) => {
        gsap.to(card, {
          y: i % 2 === 0 ? -20 : 20,
          rotation: i % 2 === 0 ? 2 : -2,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="relative w-full pt-12 pb-20 lg:pt-20 lg:pb-28 bg-trainex-bg-gray overflow-hidden"
    >
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
        {/* Header */}
        <div className="testimonials-header text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <span className="section-label">Testimonials</span>
          <h2 className="section-title mb-4">What Our Students Say</h2>
          <p className="section-description">
            Real stories from real learners who transformed their careers
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="testimonials-grid grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`testimonial-card relative bg-white rounded-2xl p-6 shadow-card transition-all duration-500 ease-expo-out ${
                index === 1 ? 'lg:mt-10' : index === 2 ? 'lg:mt-5' : ''
              }`}
              style={{
                transform:
                  hoveredCard === testimonial.id
                    ? 'translateY(-15px) rotate(0deg)'
                    : undefined,
                boxShadow:
                  hoveredCard === testimonial.id
                    ? '0 20px 60px rgba(0, 0, 0, 0.15)'
                    : undefined,
                border:
                  hoveredCard === testimonial.id
                    ? '2px solid var(--trainex-orange)'
                    : '2px solid transparent',
              }}
              onMouseEnter={() => setHoveredCard(testimonial.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Quote icon */}
              <div className="quote-icon absolute -top-3 -left-3 w-10 h-10 bg-trainex-orange rounded-full flex items-center justify-center shadow-lg">
                <Quote className="w-5 h-5 text-white" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-trainex-gray mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Course */}
              <p className="text-sm text-trainex-orange font-medium mb-4">
                {testimonial.course}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className={`testimonial-avatar relative w-12 h-12 rounded-full overflow-hidden transition-all duration-300 ${
                    hoveredCard === testimonial.id ? 'ring-2 ring-trainex-orange ring-offset-2' : ''
                  }`}
                >
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-trainex-black">{testimonial.name}</p>
                  <p className="text-sm text-trainex-gray">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
