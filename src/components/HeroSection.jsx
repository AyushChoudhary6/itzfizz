import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import './HeroSection.css';

gsap.registerPlugin(ScrollTrigger);

const HEADLINE = ['W', 'E', 'L', 'C', 'O', 'M', 'E', '\u00A0', 'I', 'T', 'Z', 'F', 'I', 'Z', 'Z'];

const HeroSection = () => {
  const sectionRef = useRef(null);
  const carRef = useRef(null);
  const trailRef = useRef(null);
  const lettersRef = useRef([]);
  const valueAddRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      const car = carRef.current;
      const trail = trailRef.current;
      const valueAdd = valueAddRef.current;

      if (!section || !car || !trail || !valueAdd) return;

      const letters = lettersRef.current.filter(Boolean);
      let endX = 0;
      let letterThresholds = [];
      let trailAttachOffset = 0;
      const visibleCarAtEnd = 0.22;
      const setTrailScaleX = gsap.quickSetter(trail, 'scaleX');

      const recalc = () => {
        const road = car.parentElement;
        if (!road) return;

        const roadWidth = road.clientWidth;
        const carWidth = car.offsetWidth || 0;
        endX = Math.max(0, roadWidth - carWidth * visibleCarAtEnd);
        trailAttachOffset = carWidth * 0.2;

        const valueRect = valueAdd.getBoundingClientRect();
        const letterCenters = letters.map((letter) => {
          const rect = letter.getBoundingClientRect();
          return rect.left - valueRect.left + rect.width / 2;
        });

        letterThresholds = letterCenters.map((center) =>
          roadWidth > 0 ? gsap.utils.clamp(0, 1, center / roadWidth) : 0
        );
      };

      recalc();
      ScrollTrigger.addEventListener('refreshInit', recalc);

      gsap.set(car, { x: 0 });
      gsap.set(trail, { scaleX: 0, transformOrigin: 'left center' });
      letters.forEach((letter) => {
        letter.style.opacity = '0';
      });

      gsap.to(car, {
        x: () => endX,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${Math.max(1, section.offsetHeight - window.innerHeight)}`,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate(self) {
            const road = car.parentElement;
            if (!road) return;

            const progress = self.progress;
            const carX = Number(gsap.getProperty(car, 'x')) || 0;
            const roadWidth = road.clientWidth;
            const trailWidth = gsap.utils.clamp(0, roadWidth, carX + trailAttachOffset);
            setTrailScaleX(roadWidth > 0 ? trailWidth / roadWidth : 0);

            letters.forEach((letter, index) => {
              letter.style.opacity = progress >= (letterThresholds[index] ?? 0) ? '1' : '0';
            });
          },
        },
      });

      const boxConfigs = [
        { id: 'box1', start: 'top+=400 top', end: 'top+=600 top' },
        { id: 'box2', start: 'top+=600 top', end: 'top+=800 top' },
        { id: 'box3', start: 'top+=800 top', end: 'top+=1000 top' },
        { id: 'box4', start: 'top+=1000 top', end: 'top+=1200 top' },
      ];

      boxConfigs.forEach(({ id, start, end }) => {
        const el = document.getElementById(id);
        if (!el) return;

        gsap.to(el, {
          opacity: 1,
          scrollTrigger: {
            trigger: section,
            start,
            end,
            scrub: 0.6,
          },
        });
      });

      return () => {
        ScrollTrigger.removeEventListener('refreshInit', recalc);
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="section">
      <div className="track">
        <div className="road">
          <img
            ref={carRef}
            src={`${import.meta.env.BASE_URL}car.png`}
            alt="McLaren 720S"
            className="car"
          />
          <div ref={trailRef} className="trail" />

          <div ref={valueAddRef} className="value-add">
            {HEADLINE.map((char, i) => (
              <span
                key={i}
                className="value-letter"
                ref={(el) => {
                  if (el) lettersRef.current[i] = el;
                }}
              >
                {char}
              </span>
            ))}
          </div>
        </div>

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
