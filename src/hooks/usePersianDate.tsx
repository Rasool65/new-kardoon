import moment from 'jalali-moment';

export const usePersianDate = () => {
  const getCurrentDate = () => {
    return moment.from(Date().toString(), 'en').locale('fa').format('YYYY/MM/DD');
  };
  const convertToPersianDate = (date: any) => {
    return moment.from(date, 'en').locale('fa').format('YYYY/MM/DD');
  };
  const convertToGregorianDate = (date: any) => {
    return moment.from(date, 'fa').locale('en').format('YYYY/MM/DD');
  };

  return { getCurrentDate, convertToPersianDate, convertToGregorianDate };
};
