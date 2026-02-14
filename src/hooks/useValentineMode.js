import { useLocation } from 'react-router-dom';

const isValentinesDay = (date) => date.getMonth() === 1 && date.getDate() === 14;

export const useValentineMode = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const override = params.get('valentine');

  if (override === '1') {
    return true;
  }

  if (override === '0') {
    return false;
  }

  return isValentinesDay(new Date());
};
