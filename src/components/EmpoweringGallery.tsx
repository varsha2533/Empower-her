import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const empoweringImages = [
  {
    src: "/images/empowerment1.jpg",
    alt: "Women supporting each other in a professional setting",
    caption: "Together We Rise",
    gradient: "from-pink-500/20 to-purple-500/20"
  },
  {
    src: "/images/empowerment2.jpg",
    alt: "Woman leading a business presentation",
    caption: "Leadership & Growth",
    gradient: "from-blue-500/20 to-teal-500/20"
  },
  {
    src: "/images/empowerment3.jpg",
    alt: "Women in STEM fields",
    caption: "Breaking Barriers",
    gradient: "from-purple-500/20 to-indigo-500/20"
  },
  {
    src: "/images/empowerment4.jpg",
    alt: "Women celebrating success",
    caption: "Celebrating Achievement",
    gradient: "from-teal-500/20 to-emerald-500/20"
  },
  {
    src: "/images/empowerment5.jpg",
    alt: "Women in leadership",
    caption: "Leading Change",
    gradient: "from-rose-500/20 to-orange-500/20"
  }
];

const EmpoweringGallery = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % empoweringImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => (prevIndex + newDirection + empoweringImages.length) % empoweringImages.length);
  };

  return (
    <div className="fixed right-8 top-32 bottom-8 w-[600px] overflow-hidden">
      <div className="relative h-full rounded-2xl overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="absolute inset-0"
          >
            <div className={`w-full h-full bg-gradient-to-br ${empoweringImages[currentIndex].gradient} rounded-2xl p-8 flex flex-col items-center justify-center`}>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <h3 className="text-2xl font-bold text-white mb-4">
                  {empoweringImages[currentIndex].caption}
                </h3>
                <p className="text-white/80 text-lg">
                  {empoweringImages[currentIndex].alt}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {empoweringImages.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? "bg-white scale-125" 
                  : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmpoweringGallery; 