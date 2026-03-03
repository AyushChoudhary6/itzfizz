import PropTypes from 'prop-types';

export const StatBox = ({ id, number, text }) => {
  return (
    <div id={id} className="stat-box">
      <div className="stat-box-number">{number}</div>
      <div className="stat-box-text">{text}</div>
    </div>
  );
};

StatBox.propTypes = {
  id: PropTypes.string.isRequired,
  number: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};
