export const GeneralHelpers = {
  toPersianNumber,
};

function toPersianNumber(value: any) {
  return (value + '')
    .replace(/1/g, '۱')
    .replace(/2/g, '۲')
    .replace(/3/g, '۳')
    .replace(/4/g, '۴')
    .replace(/5/g, '۵')
    .replace(/6/g, '۶')
    .replace(/7/g, '۷')
    .replace(/8/g, '۸')
    .replace(/9/g, '۹')
    .replace(/0/g, '۰');
}
export class UtilsHelper {
  public static fixFarsiForSearch = (s: string = '') => {
    const replaces = [
      [/ي/g, 'ی'],
      [/ك/g, 'ک'],
      [/۰/g, '0'],
      [/۱/g, '1'],
      [/۲/g, '2'],
      [/۳/g, '3'],
      [/۴/g, '4'],
      [/۵/g, '5'],
      [/۶/g, '6'],
      [/۷/g, '7'],
      [/۸/g, '8'],
      [/۹/g, '9'],
    ];
    //  YEKE
    return replaces.reduce((_elm, [from, to]) => _elm.replace(from, to.toString()), s);
  };

  public static threeDigitSeparator = (value: any) => {
    try {
      if (!value) {
        return '';
      }

      const isValueTypeSuitable = typeof value === 'number' || typeof value === 'string';
      if (!isValueTypeSuitable) {
        return '';
      }

      // Convert the `value` to string
      // value += '';

      return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      // return value.toLocaleString('en')
    } catch (e) {
      return '';
    }
  };
}
