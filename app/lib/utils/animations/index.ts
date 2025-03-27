import { Variants } from 'framer-motion';

// Message animation variants with easeInOutQuint easing
export const messageAnimationVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95,
    transition: { 
      duration: 0.4,
      ease: [0.22, 0, 0.36, 1] // easeInOutQuint
    }
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { 
      duration: 0.5,
      ease: [0.22, 0, 0.36, 1] // easeInOutQuint
    }
  },
  exit: { 
    opacity: 0,
    transition: { 
      duration: 0.3,
      ease: [0.22, 0, 0.36, 1] // easeInOutQuint
    }
  }
};

// Button hover animation variants
export const buttonHoverVariants: Variants = {
  idle: { 
    scale: 1,
    transition: { 
      duration: 0.2,
      ease: [0.22, 0, 0.36, 1] // easeInOutQuint
    }
  },
  hover: { 
    scale: 1.05,
    transition: { 
      duration: 0.2,
      ease: [0.22, 0, 0.36, 1] // easeInOutQuint
    }
  },
  tap: { 
    scale: 0.95,
    transition: { 
      duration: 0.1,
      ease: [0.22, 0, 0.36, 1] // easeInOutQuint
    }
  }
};

// Loading animation variants
export const loadingAnimationVariants: Variants = {
  initial: { 
    opacity: 0, 
    scale: 0.9,
    transition: { 
      duration: 0.3,
      ease: [0.22, 0, 0.36, 1] // easeInOutQuint
    }
  },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.4,
      ease: [0.22, 0, 0.36, 1] // easeInOutQuint
    }
  },
  exit: { 
    opacity: 0,
    scale: 0.9,
    transition: { 
      duration: 0.3,
      ease: [0.22, 0, 0.36, 1] // easeInOutQuint
    }
  }
};

// Sidebar animation variants - simplified for better sync
export const sidebarAnimationVariants: Variants = {
  closed: {
    x: '-100%',
    transition: {
      duration: 0.3,
      ease: "linear"
    }
  },
  open: {
    x: 0,
    transition: {
      duration: 0.3,
      ease: "linear"
    }
  }
};

// Input field animation variants
export const inputAnimationVariants: Variants = {
  idle: { 
    scale: 1,
    borderColor: 'rgba(111, 120, 138, 0.5)',
    transition: { 
      duration: 0.3,
      ease: [0.22, 0, 0.36, 1] // easeInOutQuint
    }
  },
  focus: { 
    scale: 1.01,
    borderColor: 'rgba(6, 223, 114, 1)',
    transition: { 
      duration: 0.4,
      ease: [0.22, 0, 0.36, 1] // easeInOutQuint
    }
  }
};
