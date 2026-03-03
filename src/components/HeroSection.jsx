import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import './HeroSection.css';

gsap.registerPlugin(ScrollTrigger);

// Letters in the headline — matching the reference exactly
const HEADLINE = ['W','E','L','C','O','M','E','\u00A0','I','T','Z','F','I','Z','Z'];

const HeroSection = () => {
  const sectionRef = useRef(null);
  const carRef    = useRef(null);
  const trailRef  = useRef(null);
  const lettersRef = useRef([]);    // individual <span> elements
  const valueAddRef = useRef(null); // the .value-add container

  useLayoutEffect(() => {
    const section  = sectionRef.current;
    const car      = carRef.current;
    const trail    = trailRef.current;
    const valueAdd = valueAddRef.current;

    if (!section || !car || !trail || !valueAdd) return;

    // Matching reference exactly: fixed carWidth = 150
    const carWidth  = 150;
    const roadWidth = window.innerWidth;
    const endX      = roadWidth - carWidth;

    // Precompute each letter's left offset relative to .value-add
    const letters       = lettersRef.current.filter(Boolean);
    const valueRect     = valueAdd.getBoundingClientRect();
    const letterOffsets = letters.map((l) => l.offsetLeft);

    // ── Car animation (scroll-scrubbed) ─────────────────────────────────────
    const carTween = gsap.to(car, {
      x: endX,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate() {
          const carX = (gsap.getProperty(car, 'x') || 0) + carWidth / 2;

          // Trail width = car center position
          gsap.set(trail, { width: carX });

          // Reveal/hide each letter based on car center vs letter position
          letters.forEach((letter, i) => {
            const letterAbsX = valueRect.left + letterOffsets[i];
            letter.style.opacity = carX >= letterAbsX ? '1' : '0';
          });
        },
      },
    });

    // ── Stat box fade-ins (pixel-based, matching reference) ──────────────────
    const boxConfigs = [
      { id: 'box1', start: 'top+=400 top', end: 'top+=600 top' },
      { id: 'box2', start: 'top+=600 top', end: 'top+=800 top' },
      { id: 'box3', start: 'top+=800 top', end: 'top+=1000 top' },
      { id: 'box4', start: 'top+=1000 top', end: 'top+=1200 top' },
    ];

    const statTweens = boxConfigs.map(({ id, start, end }) => {
      const el = document.getElementById(id);
      if (!el) return null;
      return gsap.to(el, {
        opacity: 1,
        scrollTrigger: {
          trigger: section,
          start,
          end,
          scrub: true,
        },
      });
    });

    return () => {
      carTween.kill();
      statTweens.forEach((t) => t && t.kill());
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <div ref={sectionRef} className="section">
      <div className="track">

        {/* ── Road ─────────────────────────────────────────────────── */}
        <div className="road">
          <img
            ref={carRef}
            src={`${import.meta.env.BASE_URL}car.png`}
            alt="McLaren 720S"
            className="car"
          />
          <div ref={trailRef} className="trail" />

          {/* Headline letters */}
          <div ref={valueAddRef} className="value-add">
            {HEADLINE.map((char, i) => (
              <span
                key={i}
                className="value-letter"
                ref={(el) => { if (el) lettersRef.current[i] = el; }}
              >
                {char}
              </span>
            ))}
          </div>
        </div>

        {/* ── Stat boxes (inside .track, outside .road) ─────────────── */}
        <div className="text-box" id="box1">
          <span className="num-box">58%</span>
          Increase in pick up point use
        </div>
        <div className="text-box" id="box2">
          <span className="num-box">23%</span>
          Decreased in customer phone calls
        </div>
        <div className="text-box" id="box3">
          <span className="num-box">27%</span>
          Increase in pick up point use
        </div>
        <div className="text-box" id="box4">
          <span className="num-box">40%</span>
          Decreased in customer phone calls
        </div>

      </div>
    </div>
  );
};

export default HeroSection;
