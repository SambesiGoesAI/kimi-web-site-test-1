import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Star, Clock, Users, PlayCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Course {
  id: number;
  title: string;
  category: string;
  price: string;
  rating: number;
  reviews: number;
  lessons: number;
  students: number;
  instructor: string;
  image: string;
}

const courses: Course[] = [
  {
    id: 1,
    title: 'Web Development Bootcamp',
    category: 'Development',
    price: '$89.99',
    rating: 4.9,
    reviews: 2847,
    lessons: 124,
    students: 15234,
    instructor: 'Sarah Johnson',
    image: '/course-1.jpg',
  },
  {
    id: 2,
    title: 'UI/UX Design Masterclass',
    category: 'Design',
    price: '$79.99',
    rating: 4.8,
    reviews: 1923,
    lessons: 86,
    students: 12456,
    instructor: 'Michael Chen',
    image: '/course-2.jpg',
  },
  {
    id: 3,
    title: 'Data Science Fundamentals',
    category: 'Data Science',
    price: '$99.99',
    rating: 4.9,
    reviews: 3156,
    lessons: 142,
    students: 18902,
    instructor: 'Dr. Emily Roberts',
    image: '/course-3.jpg',
  },
  {
    id: 4,
    title: 'Digital Marketing Strategy',
    category: 'Marketing',
    price: '$69.99',
    rating: 4.7,
    reviews: 987,
    lessons: 64,
    students: 8234,
    instructor: 'David Park',
    image: '/course-4.jpg',
  },
  {
    id: 5,
    title: 'Business Leadership',
    category: 'Business',
    price: '$129.99',
    rating: 4.8,
    reviews: 756,
    lessons: 48,
    students: 5678,
    instructor: 'Jennifer Adams',
    image: '/course-5.jpg',
  },
  {
    id: 6,
    title: 'Photography Essentials',
    category: 'Creative',
    price: '$59.99',
    rating: 4.9,
    reviews: 2134,
    lessons: 72,
    students: 11345,
    instructor: 'Marcus Williams',
    image: '/course-6.jpg',
  },
];

const Courses = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        '.courses-header > *',
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

      // Cards 3D flip animation
      gsap.fromTo(
        '.course-card',
        { opacity: 0, rotateY: -90 },
        {
          opacity: 1,
          rotateY: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: '.courses-grid',
            start: 'top 80%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="courses"
      ref={sectionRef}
      className="relative w-full py-20 lg:py-32 bg-white overflow-hidden"
    >
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
        {/* Header */}
        <div className="courses-header flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12 lg:mb-16">
          <div className="max-w-2xl mb-6 lg:mb-0">
            <span className="section-label">Our Courses</span>
            <h2 className="section-title mb-4">Explore Popular Courses</h2>
            <p className="section-description">
              Discover courses designed to help you master new skills and advance your career
            </p>
          </div>
          <button
            onClick={() => document.querySelector('#courses')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-secondary group self-start lg:self-auto"
          >
            View All Courses
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" />
          </button>
        </div>

        {/* Courses Grid */}
        <div
          className="courses-grid grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          style={{ perspective: '1000px' }}
        >
          {courses.map((course) => (
            <div
              key={course.id}
              className="course-card group relative bg-white rounded-2xl overflow-hidden shadow-card transition-all duration-500 ease-expo-out cursor-pointer"
              style={{
                transformStyle: 'preserve-3d',
                transform:
                  hoveredCard === course.id
                    ? 'translateY(-10px) rotateX(5deg) rotateY(-5deg)'
                    : 'translateY(0) rotateX(0) rotateY(0)',
                boxShadow:
                  hoveredCard === course.id
                    ? '0 20px 60px rgba(0, 0, 0, 0.2)'
                    : '0 4px 20px rgba(0, 0, 0, 0.1)',
              }}
              onMouseEnter={() => setHoveredCard(course.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                
                {/* Category badge */}
                <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold text-black rounded-full">
                  {course.category}
                </span>

                {/* Price badge */}
                <span className="absolute top-4 right-4 px-3 py-1 bg-trainex-orange text-white text-sm font-bold rounded-full transition-transform duration-300 group-hover:scale-110">
                  {course.price}
                </span>

                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                    <PlayCircle className="w-8 h-8 text-trainex-orange" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-black mb-2 line-clamp-2 group-hover:text-trainex-orange transition-colors duration-300">
                  {course.title}
                </h3>

                <p className="text-sm text-trainex-gray mb-3">{course.instructor}</p>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold text-black">{course.rating}</span>
                  </div>
                  <span className="text-sm text-trainex-light-gray">
                    ({course.reviews.toLocaleString()} reviews)
                  </span>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-trainex-gray">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.lessons} lessons</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{course.students.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Enroll button */}
              <div className="px-5 pb-5">
                <button className="w-full py-3 bg-trainex-bg-gray text-black font-semibold rounded-xl transition-all duration-300 group-hover:bg-trainex-orange group-hover:text-white flex items-center justify-center gap-2">
                  Enroll Now
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Courses;
