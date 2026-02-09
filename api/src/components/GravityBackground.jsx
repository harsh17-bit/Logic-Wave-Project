import React from "react";
import Particles from "@tsparticles/react";
import { loadSlim } from "tsparticles-slim";

const GravityBackground = () => {
  const particlesInit = async (engine) => {
    await loadSlim(engine);
  };

  const options = {
    fullScreen: { enable: true, zIndex: -1 },

    background: {
      color: "#060b1f"
    },

    particles: {
      number: { value: 90 },
      size: { value: 3 },
      move: {
        enable: true,
        speed: 2,
        random: true,
        outModes: "out"
      },
      links: {
        enable: true,
        distance: 130,
        color: "#66fcf1"
      },
      shape: { type: "circle" },
      color: { value: "#66fcf1" }
    },

    interactivity: {
      events: {
        onHover: { enable: true, mode: "repulse" }, // touch/mouse push
        onClick: { enable: true, mode: "push" }
      },
      modes: {
        repulse: { distance: 150, duration: 0.4 },
        push: { quantity: 5 }
      }
    }
  };

  return <Particles init={particlesInit} options={options} />;
};

export default GravityBackground;
