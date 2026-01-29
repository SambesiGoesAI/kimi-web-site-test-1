import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Clock, Calendar } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface BlogPost {
  id: number;
  title: string;
  category: string;
  date: string;
  readTime: string;
  excerpt?: string;
  image: string;
  featured?: boolean;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: '10 Essential Skills for 2024\'s Job Market',
    category: 'Career Tips',
    date: 'January 15, 2024',
    readTime: '8 min read',
    excerpt: 'Discover the most in-demand skills that employers are looking for this year...',
    image: '/blog-1.jpg',
    featured: true,
  },
  {
    id: 2,
    title: 'How to Build a Portfolio That Gets You Hired',
    category: 'Design',
    date: 'January 12, 2024',
    readTime: '6 min read',
    image: '/blog-2.jpg',
  },
  {
    id: 3,
    title: 'The Future of Remote Work: What You Need to Know',
    category: 'Business',
    date: 'January 10, 2024',
    readTime: '5 min read',
    image: '/blog-3.jpg',
  },
  {
    id: 4,
    title: 'Mastering Data Visualization: A Complete Guide',
    category: 'Data Science',
    date: 'January 8, 2024',
    readTime: '10 min read',
    image: '/blog-4.jpg',
  },
  {
    id: 5,
    title: 'From Zero to Hero: Learning to Code in 2024',
    category: 'Development',
    date: 'January 5, 2024',
    readTime: '7 min read',
    image: '/blog-5.jpg',
  },
];

const Blog = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        '.blog-header > *',
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

      // Featured post animation
      gsap.fromTo(
        '.blog-featured',
        { opacity: 0, x: -60 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: '.blog-grid',
            start: 'top 80%',
            once: true,
          },
        }
      );

      // Regular posts animation
      gsap.fromTo(
        '.blog-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: '.blog-grid',
            start: 'top 75%',
            once: true,
          },
        }
      );

      // Image parallax zoom
      gsap.fromTo(
        '.blog-featured img',
        { scale: 1.05 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.blog-featured',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const featuredPost = blogPosts.find((post) => post.featured);
  const regularPosts = blogPosts.filter((post) => !post.featured);

  return (
    <section
      id="blog"
      ref={sectionRef}
      className="relative w-full py-20 lg:py-32 bg-trainex-bg-gray overflow-hidden"
    >
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
        {/* Header */}
        <div className="blog-header flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12 lg:mb-16">
          <div className="max-w-2xl mb-6 lg:mb-0">
            <span className="section-label">Our Blog</span>
            <h2 className="section-title mb-4">Latest Insights & Articles</h2>
            <p className="section-description">
              Stay updated with the latest trends, tips, and insights in professional development
            </p>
          </div>
          <button className="btn-secondary group self-start lg:self-auto">
            View All Posts
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" />
          </button>
        </div>

        {/* Blog Grid */}
        <div className="blog-grid grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Featured Post */}
          {featuredPost && (
            <div className="blog-featured group relative bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500 cursor-pointer lg:row-span-2">
              <div className="relative h-64 lg:h-80 overflow-hidden">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {/* Category badge */}
                <span className="absolute top-4 left-4 px-3 py-1 bg-trainex-orange text-white text-xs font-semibold rounded-full">
                  {featuredPost.category}
                </span>

                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl lg:text-2xl font-semibold text-white mb-3 group-hover:text-trainex-orange transition-colors duration-300">
                    {featuredPost.title}
                  </h3>
                  <p className="text-white/80 mb-4 line-clamp-2">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-white/70">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{featuredPost.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{featuredPost.readTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Regular Posts */}
          <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
            {regularPosts.map((post) => (
              <div
                key={post.id}
                className="blog-card group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500 cursor-pointer"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  
                  {/* Category badge */}
                  <span className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold text-black rounded-full">
                    {post.category}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="text-base font-semibold text-black mb-3 line-clamp-2 group-hover:text-trainex-orange transition-colors duration-300">
                    {post.title}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-trainex-gray mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-trainex-orange font-medium text-sm group-hover:gap-3 transition-all duration-300">
                    <span>Read More</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blog;
