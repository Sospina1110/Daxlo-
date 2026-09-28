"use client";

import { motion, type Variants } from "motion/react";
import { EASE } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  /** Al cargar en vez de al entrar en pantalla: para lo que está arriba del pliegue. */
  alCargar?: boolean;
};

// Aparición con desenfoque, subida y opacidad: el efecto de entrada de la plantilla.
export function Reveal({ children, className, delay = 0, y = 24, alCargar = false }: RevealProps) {
  const inicial = { opacity: 0, y, filter: "blur(8px)" };
  const final = { opacity: 1, y: 0, filter: "blur(0px)" };
  const transition = { duration: 0.8, delay, ease: EASE };
  return alCargar ? (
    <motion.div className={className} initial={inicial} animate={final} transition={transition}>
      {children}
    </motion.div>
  ) : (
    <motion.div
      className={className}
      initial={inicial}
      whileInView={final}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}

const contenedor: Variants = {
  oculto: {},
  visible: (escalon: number) => ({ transition: { staggerChildren: escalon } }),
};

const elemento: Variants = {
  oculto: { opacity: 0, y: 24, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: EASE } },
};

// Grupo cuyos hijos aparecen escalonados, uno detrás de otro.
export function Stagger({
  children,
  className,
  escalon = 0.09,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  escalon?: number;
  as?: "div" | "ul";
}) {
  const Comp = as === "ul" ? motion.ul : motion.div;
  return (
    <Comp
      className={className}
      variants={contenedor}
      custom={escalon}
      initial="oculto"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
    >
      {children}
    </Comp>
  );
}

export function StaggerItem({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li";
}) {
  const Comp = as === "li" ? motion.li : motion.div;
  return (
    <Comp className={className} variants={elemento}>
      {children}
    </Comp>
  );
}
