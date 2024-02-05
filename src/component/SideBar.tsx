import React, { useEffect, useState } from "react";
import styles from "./sidebar.module.scss";
import { motion } from "framer-motion";

export const SideBar = () => {
  const [selected, setSelected] = useState("");

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.nav
      initial={{ x: -70 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
      className={styles.sideBar}
    >
      <a 
      className="cursor-pointer text-xl"
      onClick={() => scrollToSection("about")}>
      Interview Introduction
      </a>
      <a onClick={() => scrollToSection("projects")}>
      Questions and Answers
      </a>
      <a onClick={() => scrollToSection("experience")}>
      Recommended YouTube Videos
      </a>
    
    </motion.nav>
  );
};
