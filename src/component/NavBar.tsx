import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const NavBar = () => {
  const [selected, setSelected] = useState("");

  useEffect(() => {
    const sections = document.querySelectorAll(".section-wrapper");

    const options = {
      threshold: 0.3,
    };

    const callback = (entries:any) => {
      entries.forEach((entry:any) => {
        if (entry.isIntersecting) {
          setSelected(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);

    sections.forEach((section) => observer.observe(section));
  }, []);

  return (
    <motion.nav
      initial={{ x: -70 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-background-dark h-screen sticky top-0 left-0 z-20 flex flex-col items-center overflow-y-scroll"
    >
      <span className="logo">
        B<span className="text-brand">.</span>
      </span>
      <motion.a
        initial={{ x: -70 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        href="#about"
        onClick={() => {
          setSelected("about");
        }}
        className={`${
          selected === "about" ? "bg-background border-r border-transparent opacity-100" : ""
        } h-20 flex-shrink-0 writing-vertical text-sm font-light flex items-center justify-center transition duration-100 w-full`}
      >
        About
      </motion.a>
      {/* ... other menu items ... */}
    </motion.nav>
  );
};

export default NavBar;
