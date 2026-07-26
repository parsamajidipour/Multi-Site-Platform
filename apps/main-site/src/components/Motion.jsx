import { motion, useReducedMotion } from "framer-motion";

const revealVariants = {
  hidden: ({ y = 28, scale = 1 }) => ({
    opacity: 0,
    y,
    scale,
    filter: "blur(8px)",
  }),
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
  },
};

const staggerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 24,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
  },
};

export function Reveal({ as = "div", children, className = "", delay = 0, y = 28, scale = 1, ...props }) {
  const prefersReducedMotion = useReducedMotion();
  const Component = motion[as] || motion.div;

  if (prefersReducedMotion) {
    const StaticComponent = as;
    return <StaticComponent className={className} {...props}>{children}</StaticComponent>;
  }

  return (
    <Component
      className={className}
      {...props}
      custom={{ y, scale }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.22, margin: "0px 0px -8% 0px" }}
      variants={revealVariants}
      transition={{ duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Component>
  );
}

export function Stagger({ as = "div", children, className = "", ...props }) {
  const prefersReducedMotion = useReducedMotion();
  const Component = motion[as] || motion.div;

  if (prefersReducedMotion) {
    const StaticComponent = as;
    return <StaticComponent className={className} {...props}>{children}</StaticComponent>;
  }

  return (
    <Component
      className={className}
      {...props}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18, margin: "0px 0px -8% 0px" }}
      variants={staggerVariants}
    >
      {children}
    </Component>
  );
}

export function StaggerItem({ as = "div", children, className = "", ...props }) {
  const prefersReducedMotion = useReducedMotion();
  const Component = motion[as] || motion.div;

  if (prefersReducedMotion) {
    const StaticComponent = as;
    return <StaticComponent className={className} {...props}>{children}</StaticComponent>;
  }

  return (
    <Component className={className} {...props} variants={itemVariants} transition={{ duration: 0.64, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </Component>
  );
}
