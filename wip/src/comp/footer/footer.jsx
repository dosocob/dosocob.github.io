import React, { useRef, useEffect } from "react";
import "./footer.css";

const Footer = () => {
  const footerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const footer = footerRef.current;
      if (footer.getBoundingClientRect().top <= window.innerHeight) {
        footer.classList.add('show');
      } else {
        footer.classList.remove('show');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={footerRef} className="footer">
      <h1>Contact me</h1>
      <div className="content">
        <a href="https://www.instagram.com/beingmehumandesign/">Instagram</a>
        <a href="https://www.facebook.com/beingmehumandesign">Facebook</a>
        <a href="https://www.t.me/emilyamoraea">Telegram</a>
        <a href="mailto:support@beingmehumandesign.com">support@beingmehumandesign.com</a>
      </div>

    </div>
  );
};

export default Footer;