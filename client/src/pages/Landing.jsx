import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { IoChevronDown, IoArrowForward, IoGlobeOutline, IoShieldCheckmarkOutline, IoChatbubblesOutline, IoLanguageOutline, IoAccessibility } from 'react-icons/io5';
import AccessibilityFeatures from '../components/accessibility/AccessibilityFeatures';

const features = [
  {
    icon: <IoGlobeOutline className="w-8 h-8" />,
    title: 'Global Connections',
    description: 'Connect with people from anywhere in the world, instantly',
  },
  {
    icon: <IoShieldCheckmarkOutline className="w-8 h-8" />,
    title: 'Anonymous & Private',
    description: 'No registration required, your privacy is guaranteed',
  },
  {
    icon: <IoChatbubblesOutline className="w-8 h-8" />,
    title: 'Interest-Based Matching',
    description: 'Find people who share your passions and interests',
  },
  {
    icon: <IoLanguageOutline className="w-8 h-8" />,
    title: 'Real-Time Translation',
    description: 'Chat in your language with anyone, anywhere',
  },
  {
    icon: <IoAccessibility className="w-8 h-8" />,
    title: 'Accessibility Features',
    description: 'Inclusive design for users with diverse abilities',
  },
];

const testimonials = [
  {
    quote: "HookChat has changed how I meet people online. The matching algorithm is incredibly accurate.",
    name: "Alex M.",
    location: "New York, USA"
  },
  {
    quote: "I've made friends from countries I've never even visited. The translation feature works perfectly.",
    name: "Sophia L.",
    location: "Paris, France"
  },
  {
    quote: "As someone who values privacy, I appreciate that I can chat anonymously yet still have meaningful conversations.",
    name: "Raj P.",
    location: "Mumbai, India"
  }
];

export default function Landing() {
  const navigate = useNavigate();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide header on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 60) {
        setIsHeaderVisible(false);
      } else {
        setIsHeaderVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);
  
  useEffect(() => {
    // Auto-advance testimonials
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="h-full overflow-y-auto overflow-x-hidden text-white scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
      {/* Header */}
      <motion.header 
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-black/5"
        initial={{ y: 0 }}
        animate={{ y: isHeaderVisible ? 0 : -80 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-2xl font-medium tracking-tight"
          >
            Hook<span className="text-purple-400">Chat</span>
          </motion.div>
          
          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => navigate('/accessibility')}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 text-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Accessibility settings"
            >
              <IoAccessibility className="w-5 h-5" />
            </motion.button>
            
            <motion.button
              onClick={() => navigate('/setup')}
              className="px-5 py-2 rounded-full bg-white text-black font-medium text-sm tracking-wide transition-all hover:bg-opacity-90"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Start Chatting
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 pt-16 relative">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          />
        </div>
        
        <div className="max-w-5xl mx-auto text-center z-10 py-20">
          <motion.h1 
            className="text-5xl sm:text-6xl md:text-7xl font-medium tracking-tight leading-none mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Connect with <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">people</span> who share your interests
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            An anonymous chat platform that connects you with like-minded individuals from around the world, with seamless real-time translation and accessibility features.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
          >
            <motion.button
              onClick={() => navigate('/setup')}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 font-medium text-base sm:text-lg tracking-wide flex items-center justify-center gap-2 w-full sm:w-auto"
              whileHover={{ scale: 1.03, boxShadow: "0 10px 30px -10px rgba(111, 66, 193, 0.5)" }}
              whileTap={{ scale: 0.97 }}
            >
              Start Chatting <IoArrowForward />
            </motion.button>
            
            <motion.a
              href="#how-it-works"
              className="px-8 py-4 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 font-medium text-base sm:text-lg tracking-wide flex items-center justify-center gap-2 w-full sm:w-auto"
              whileHover={{ scale: 1.03, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              whileTap={{ scale: 0.97 }}
            >
              Learn More <IoChevronDown />
            </motion.a>
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
          <motion.div
            animate={{ 
              y: [0, 10, 0],
              opacity: [0.3, 1, 0.3]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <IoChevronDown className="w-6 h-6 text-white/50" />
          </motion.div>
        </div>
      </section>

      {/* Product Demo */}
      <section id="how-it-works" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-medium tracking-tight mb-6">
              Simple, Seamless Experience
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Connect with strangers who share your interests in just a few clicks
            </p>
          </motion.div>
          
          <div className="relative">
            <motion.div 
              className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-2 md:p-3 shadow-2xl max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative aspect-[16/9] bg-[#0c0c0c] rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-blue-600/10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div 
                    className="w-16 h-16 rounded-full bg-white flex items-center justify-center cursor-pointer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#000">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </motion.div>
                </div>
              </div>
            </motion.div>
            
            {/* Floating elements */}
            <motion.div 
              className="absolute -right-6 top-1/3 w-40 h-40 bg-purple-600 rounded-full blur-[100px] opacity-30"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.3, 0.2],
              }}
              transition={{ duration: 5, repeat: Infinity }}
            />
            
            <motion.div 
              className="absolute -left-10 bottom-0 w-32 h-32 bg-blue-600 rounded-full blur-[80px] opacity-20"
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.1, 0.25, 0.1],
              }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-medium tracking-tight mb-6">
              Features You'll Love
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Designed with user experience and privacy at the forefront
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {features.map((feature, index) => (
              <motion.div 
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8"
              >
                <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 w-16 h-16 rounded-full flex items-center justify-center mb-6 text-white">
                  {feature.icon}
                </div>
                <h3 className="text-xl md:text-2xl font-medium mb-4">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-medium tracking-tight mb-6">
              What People Are Saying
            </h2>
          </motion.div>
          
          <div className="relative h-72">
            <AnimatePresence mode="wait">
              {testimonials.map((testimonial, index) => (
                index === currentTestimonial && (
                  <motion.div
                    key={testimonial.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.7 }}
                    className="absolute inset-0 flex flex-col items-center justify-center text-center"
                  >
                    <p className="text-2xl md:text-3xl italic font-light text-white/90 max-w-4xl mb-8 leading-relaxed">
                      "{testimonial.quote}"
                    </p>
                    <p className="text-lg font-medium">{testimonial.name}</p>
                    <p className="text-white/50">{testimonial.location}</p>
                  </motion.div>
                )
              ))}
            </AnimatePresence>
            
            <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    index === currentTestimonial 
                      ? 'bg-white scale-125' 
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`View testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-black/5" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-10 md:p-16 text-center"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight mb-6">
              Ready to connect with the world?
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-10">
              Join thousands of users who are already making meaningful connections.
            </p>
            <motion.button
              onClick={() => navigate('/setup')}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 font-medium text-lg tracking-wide inline-flex items-center gap-2"
              whileHover={{ scale: 1.03, boxShadow: "0 10px 30px -10px rgba(111, 66, 193, 0.5)" }}
              whileTap={{ scale: 0.97 }}
            >
              Start Chatting <IoArrowForward />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <div className="text-2xl font-medium mb-4">
                Hook<span className="text-purple-400">Chat</span>
              </div>
              <p className="text-white/50 max-w-xs">
                Connecting people across languages and borders, one chat at a time.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
              <div>
                <h3 className="text-sm uppercase tracking-wider text-white/50 mb-4">Product</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-white/70 hover:text-white transition-colors">Features</a></li>
                  <li><a href="#" className="text-white/70 hover:text-white transition-colors">How it works</a></li>
                  <li><a href="#" className="text-white/70 hover:text-white transition-colors">Pricing</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm uppercase tracking-wider text-white/50 mb-4">Company</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-white/70 hover:text-white transition-colors">About us</a></li>
                  <li><a href="#" className="text-white/70 hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="text-white/70 hover:text-white transition-colors">Careers</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm uppercase tracking-wider text-white/50 mb-4">Legal</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-white/70 hover:text-white transition-colors">Privacy</a></li>
                  <li><a href="#" className="text-white/70 hover:text-white transition-colors">Terms</a></li>
                  <li><a href="#" className="text-white/70 hover:text-white transition-colors">Cookie Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-white/50 text-sm">
            <p>© {new Date().getFullYear()} HookChat. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <a href="#" className="hover:text-white">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/></svg>
              </a>
              <a href="#" className="hover:text-white">
                <span className="sr-only">GitHub</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/></svg>
              </a>
              <a href="#" className="hover:text-white">
                <span className="sr-only">Instagram</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Add the AccessibilityFeatures component */}
      <AccessibilityFeatures />
    </div>
  );
} 