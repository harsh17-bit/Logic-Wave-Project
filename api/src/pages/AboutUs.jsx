import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiHome, FiUsers, FiAward, FiShield, FiTrendingUp, FiHeart,
  FiCheckCircle, FiMapPin, FiPhone, FiMail, FiLinkedin,
  FiTwitter, FiTarget, FiZap, FiStar,
} from "react-icons/fi";
import "./AboutUs.css";

/* ─────────────────── data ─────────────────── */

const STATS = [
  { icon: FiHome,      value: "12L+",   label: "Properties Listed"  },
  { icon: FiUsers,     value: "2M+",    label: "Happy Customers"    },
  { icon: FiMapPin,    value: "500+",   label: "Cities Covered"     },
  { icon: FiAward,     value: "10+",    label: "Years of Trust"     },
];

const VALUES = [
  {
    icon: FiShield,
    title: "Trust & Transparency",
    desc: "Every property is verified on-site. We believe honest information builds lasting relationships.",
    color: "#8B4513",
  },
  {
    icon: FiTarget,
    title: "Customer First",
    desc: "Your dream matters most. Our team works tirelessly to match you with the perfect property.",
    color: "#7CB342",
  },
  {
    icon: FiZap,
    title: "Innovation",
    desc: "We harness cutting-edge technology to make your property search faster and smarter.",
    color: "#F4A261",
  },
  {
    icon: FiHeart,
    title: "Community",
    desc: "We don't just sell homes — we help build thriving neighbourhoods across India.",
    color: "#1976D2",
  },
];

const TEAM = [
  {
    name: "Arjun Mehta",
    role: "Founder & CEO",
    bio: "15 years in real estate. Passionate about making home ownership accessible to every Indian family.",
    initials: "AM",
    color: "#8B4513",
    social: { linkedin: "#", twitter: "#" },
  },
  {
    name: "Priya Sharma",
    role: "Chief Technology Officer",
    bio: "Ex-Google engineer who built UrbanStay's AI-powered property matching engine from the ground up.",
    initials: "PS",
    color: "#7CB342",
    social: { linkedin: "#", twitter: "#" },
  },
  {
    name: "Ravi Kumar",
    role: "Head of Operations",
    bio: "Ensures every listing is verified, every transaction is smooth and every customer is smiling.",
    initials: "RK",
    color: "#F4A261",
    social: { linkedin: "#", twitter: "#" },
  },
  {
    name: "Sneha Patel",
    role: "Head of Customer Success",
    bio: "Believe that buying a home should be exciting, not stressful. She makes that belief a reality.",
    initials: "SP",
    color: "#1976D2",
    social: { linkedin: "#", twitter: "#" },
  },
];

const MILESTONES = [
  { year: "2014", title: "Founded",          desc: "UrbanStay was born in a small Bengaluru office with a bold dream." },
  { year: "2016", title: "100K Listings",    desc: "Crossed 1 lakh verified property listings across 10 major cities." },
  { year: "2018", title: "Series A Funding", desc: "Raised ₹50 Cr to expand tech infrastructure and city coverage." },
  { year: "2020", title: "National Footprint",desc: "Expanded to 200+ cities with a dedicated ground-verification network." },
  { year: "2022", title: "AI Launch",        desc: "Launched India's first AI-based smart property recommendation engine." },
  { year: "2024", title: "2M Customers",     desc: "Celebrated 20 lakh happy families who found their perfect home." },
];

const WHY_US = [
  "10,000+ new properties added every day",
  "Physical verification of photos, videos & documents",
  "Dedicated relationship managers for premium buyers",
  "Zero brokerage on select listings",
  "Secure escrow-backed transactions",
  "24 × 7 customer support",
];

/* ─────────────────── animated counter ─────────────────── */
const useCountUp = (end, duration = 1800, startTrigger = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!startTrigger) return;
    const isDecimal = end.toString().includes(".");
    const numericEnd = parseFloat(end.replace(/[^0-9.]/g, ""));
    const suffix = end.replace(/[0-9.]/g, "");
    let start = 0;
    const step = numericEnd / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= numericEnd) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(
          (isDecimal ? start.toFixed(1) : Math.floor(start)) + suffix
        );
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration, startTrigger]);
  return count || "0";
};

// eslint-disable-next-line no-unused-vars
const StatCard = ({ icon: Icon, value, label, delay }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const display = useCountUp(value, 1600, visible);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.4 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="about-stat-card" style={{ animationDelay: delay }}>
      <div className="about-stat-icon">
        <Icon size={28} />
      </div>
      <p className="about-stat-value">{display}</p>
      <p className="about-stat-label">{label}</p>
    </div>
  );
};

/* ─────────────────── page ─────────────────── */
const AboutUs = () => {
  return (
    <div className="about-page">

      {/* ── HERO ── */}
      <section className="about-hero">
        <div className="about-hero-bg-circle c1" />
        <div className="about-hero-bg-circle c2" />
        <div className="about-hero-inner">
          <span className="about-pill">About UrbanStay</span>
          <h1 className="about-hero-title">
            India's Most Trusted&nbsp;
            <span className="brand-gradient">Real Estate</span>&nbsp;Platform
          </h1>
          <p className="about-hero-sub">
            Since 2014, UrbanStay has helped over <strong>2 million families</strong> find
            their perfect home — with verified listings, transparent pricing and
            a team that genuinely cares.
          </p>
          <div className="about-hero-cta">
            <Link to="/properties?listingType=buy" className="btn-primary-solid">
              Explore Properties
            </Link>
            <Link to="/faq" className="btn-ghost">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="about-stats-section">
        <div className="about-stats-grid">
          {STATS.map((s, i) => (
            <StatCard key={s.label} {...s} delay={`${i * 0.1}s`} />
          ))}
        </div>
      </section>

      {/* ── MISSION & VISION ── */}
      <section className="about-mv-section">
        <div className="about-mv-grid">
          <div className="about-mv-card mission">
            <div className="about-mv-icon">
              <FiTarget size={32} />
            </div>
            <h2>Our Mission</h2>
            <p>
              To democratise real estate in India by making it simple, transparent
              and accessible for every family — whether they are first-time buyers
              in a tier-2 city or seasoned investors in a metro.
            </p>
          </div>
          <div className="about-mv-card vision">
            <div className="about-mv-icon">
              <FiTrendingUp size={32} />
            </div>
            <h2>Our Vision</h2>
            <p>
              A future where finding, buying or renting a home is as simple as a
              few taps — powered by verified data, AI-driven insights and a network
              you can trust.
            </p>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="about-values-section">
        <div className="about-section-header">
          <span className="about-pill">What We Stand For</span>
          <h2>Our Core Values</h2>
          <p>The principles that guide every decision at UrbanStay</p>
        </div>
        <div className="about-values-grid">
          {VALUES.map((v) => (
            <div key={v.title} className="about-value-card">
              <div className="about-value-icon" style={{ backgroundColor: v.color + "18", color: v.color }}>
                <v.icon size={26} />
              </div>
              <h3>{v.title}</h3>
              <p>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY US ── */}
      <section className="about-why-section">
        <div className="about-why-inner">
          <div className="about-why-text">
            <span className="about-pill light">Why UrbanStay?</span>
            <h2>We Go the Extra Mile for You</h2>
            <p>
              There are dozens of property platforms out there — here's what makes
              UrbanStay the choice of millions.
            </p>
            <ul className="about-why-list">
              {WHY_US.map((item) => (
                <li key={item}>
                  <FiCheckCircle size={18} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link to="/post-property" className="btn-primary-solid mt-6 inline-flex">
              List Your Property Free
            </Link>
          </div>
          <div className="about-why-visual">
            <div className="about-why-card floating">
              <FiShield size={40} style={{ color: "var(--color-primary)" }} />
              <h4>100% Verified Listings</h4>
              <p>Our on-ground team physically verifies every property before it goes live.</p>
            </div>
            <div className="about-why-card floating delay-1">
              <FiAward size={40} style={{ color: "var(--color-accent)" }} />
              <h4>Award-Winning Service</h4>
              <p>Voted India's #1 PropTech platform three years running.</p>
            </div>
            <div className="about-why-card floating delay-2">
              <FiStar size={40} style={{ color: "#F4A261" }} />
              <h4>4.8 ★ Customer Rating</h4>
              <p>Based on 1.2 lakh verified reviews on Google and Trustpilot.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── STORY / TIMELINE ── */}
      <section className="about-timeline-section">
        <div className="about-section-header">
          <span className="about-pill">Our Journey</span>
          <h2>A Decade of Making Homes Happen</h2>
          <p>From a small startup to India's most trusted real estate platform</p>
        </div>
        <div className="about-timeline">
          {MILESTONES.map((m, i) => (
            <div key={m.year} className={`about-timeline-item ${i % 2 === 0 ? "left" : "right"}`}>
              <div className="about-timeline-dot" />
              <div className="about-timeline-card">
                <span className="about-timeline-year">{m.year}</span>
                <h4>{m.title}</h4>
                <p>{m.desc}</p>
              </div>
            </div>
          ))}
          <div className="about-timeline-line" />
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="about-team-section">
        <div className="about-section-header">
          <span className="about-pill">The People Behind UrbanStay</span>
          <h2>Meet Our Leadership Team</h2>
          <p>Passionate individuals on a mission to transform Indian real estate</p>
        </div>
        <div className="about-team-grid">
          {TEAM.map((member) => (
            <div key={member.name} className="about-team-card">
              <div className="about-team-avatar" style={{ backgroundColor: member.color + "20", color: member.color }}>
                {member.initials}
              </div>
              <h3>{member.name}</h3>
              <span className="about-team-role">{member.role}</span>
              <p>{member.bio}</p>
              <div className="about-team-social">
                <a href={member.social.linkedin} aria-label="LinkedIn" className="about-social-btn">
                  <FiLinkedin size={16} />
                </a>
                <a href={member.social.twitter} aria-label="Twitter" className="about-social-btn">
                  <FiTwitter size={16} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CONTACT CTA ── */}
      <section className="about-contact-section">
        <div className="about-contact-inner">
          <span className="about-pill light">Get In Touch</span>
          <h2>Have Questions? We'd Love to Hear From You</h2>
          <p>Our team is available round the clock to help you find your perfect property.</p>
          <div className="about-contact-cards">
            <div className="about-contact-card">
              <FiPhone size={22} />
              <div>
                <strong>Call Us</strong>
                <span>+91 98765 43210</span>
              </div>
            </div>
            <div className="about-contact-card">
              <FiMail size={22} />
              <div>
                <strong>Email Us</strong>
                <span>hello@urbanstay.in</span>
              </div>
            </div>
            <div className="about-contact-card">
              <FiMapPin size={22} />
              <div>
                <strong>Visit Us</strong>
                <span>12th Floor, Tech Park, Bengaluru</span>
              </div>
            </div>
          </div>
          <Link to="/properties?listingType=buy" className="btn-primary-solid mt-8 inline-flex">
            Start Your Search Today
          </Link>
        </div>
      </section>

    </div>
  );
};

export default AboutUs;
