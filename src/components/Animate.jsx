import { motion } from "framer-motion";

const SlideIn = ({
  children,
  direction, // 'left', 'right', 'top', 'bottom'
  type,      // 'fade', 'zoomIn', 'zoomOut', etc.
  duration = 0.6,
  delay = 0,
  className = "",
  viewport = { once: true, amount: 0.2 },
  customX,
  customY,
}) => {
  const variants = {
    left: { opacity: 0, x: -50 },
    right: { opacity: 0, x: 50 },
    top: { opacity: 0, y: -50 },
    bottom: { opacity: 0, y: 50 },
    fade: { opacity: 0 },
    zoomIn: { opacity: 0, scale: 0.8 },
    zoomOut: { opacity: 0, scale: 1.2 },
    rotateIn: { opacity: 0, rotate: -15 },
    flipY: { opacity: 0, rotateY: 90 },
    flipX: { opacity: 0, rotateX: 90 },
    skewIn: { opacity: 0, skewX: 10 },
    bounceIn: { opacity: 0, y: 50 },
    blurIn: { opacity: 0, filter: "blur(10px)" },
  };

  // Pick animation based on type first, fallback to direction
  let initialVariant = type
    ? variants[type]
    : direction
    ? variants[direction]
    : variants.fade; // default if nothing passed

  // Apply overrides if provided
  if (customX !== undefined) initialVariant = { ...initialVariant, x: customX };
  if (customY !== undefined) initialVariant = { ...initialVariant, y: customY };

  return (
    <motion.div
      initial={initialVariant}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotate: 0,
        skewX: 0,
        filter: "blur(0px)",
      }}
      transition={{ duration, delay, ease: "easeOut" }}
      viewport={viewport}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default SlideIn;
