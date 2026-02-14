import React from 'react';
import styles from './ValentineCountdownStrip.module.css';
import { useValentineMode } from '../../hooks/useValentineMode';

const formatTimeRemaining = (ms) => {
  if (ms <= 0) {
    return 'Final minutes';
  }

  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${minutes.toString().padStart(2, '0')}m left`;
};

const ValentineCountdownStrip = () => {
  const isValentineMode = useValentineMode();
  const [timeLabel, setTimeLabel] = React.useState('');

  React.useEffect(() => {
    if (!isValentineMode) {
      return;
    }

    const update = () => {
      const now = new Date();
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);
      setTimeLabel(formatTimeRemaining(endOfDay.getTime() - now.getTime()));
    };

    update();
    const timer = window.setInterval(update, 30000);

    return () => {
      window.clearInterval(timer);
    };
  }, [isValentineMode]);

  if (!isValentineMode) {
    return null;
  }

  return (
    <section className={styles.strip} aria-label="Valentine's Day promotion">
      <p className={styles.text}>
        <strong>Valentine Special</strong> Ends tonight at 11:59 PM. {timeLabel}
      </p>
    </section>
  );
};

export default ValentineCountdownStrip;
