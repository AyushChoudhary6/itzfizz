import { StatBox } from './StatBox';
import './HeroSection.css';

const HeroSectionDebug = () => {
  const headline = 'WELCOME ITZFIZZ'.split('');

  return (
    <div className="section" style={{ height: 'auto', minHeight: '200vh' }}>
      <div className="track" style={{ position: 'relative', height: '100vh' }}>
        {/* Stat Boxes Debug */}
        <div className="stat-boxes-container">
          <StatBox id="box1" number="58%" text="Increase pick up" />
        </div>

        {/* Road Debug */}
        <div className="road" style={{ background: '#1e1e1e' }}>
          <div className="trail" style={{ background: '#45db7d', width: '30%' }}></div>
          
          <img 
            src="/car.png" 
            alt="McLaren 720S" 
            className="car"
            style={{ maxWidth: '150px', height: 'auto' }}
          />

          {/* Letters Debug */}
          <div className="letters-container">
            {headline.map((letter, index) => (
              <span key={index} className="letter">
                {letter === ' ' ? '\u00A0' : letter}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSectionDebug;
