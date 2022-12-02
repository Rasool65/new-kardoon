import React from 'react';
import MobilePicker from './MobilePicker';
import { GeneralHelpers } from '../../utils/GeneralHelpers';
import { ConvertDate } from '../../utils/ConvertDate';

class WeekPicker extends React.Component {
  constructor(props) {
    super(props);
    this.onSelectCallBack = this.onSelectCallBack.bind(this);

    this.selectdDef = '';
    this.timeShifts = [
      { startTime: 8, timeText: '08:00-12:00' },
      {
        startTime: 12,
        timeText: '12:00-16:00',
      },
      { startTime: 16, timeText: '16:00-20:00' },
      { startTime: 20, timeText: '20:00-24:00' },
    ];
    this.days1 = [];
    this.h = parseInt(new Date().getHours() + 5);
    this.q = this.h > 8 && this.h <= 12 ? 1 : this.h > 12 && this.h <= 16 ? 2 : this.h > 16 && this.h <= 20 ? 3 : 4;
    this.state = { days: [], selectedDate: '', selectedHour: '', selectedMin: '', value: parseInt(this.q) };
  }

  componentDidMount() {
    const defHour = parseInt(this.props.selectedDate.substring(11, 13));
    let hourId = 0;
    switch (defHour) {
      case 8: {
        hourId = 1;
        break;
      }
      case 12: {
        hourId = 2;
        break;
      }
      case 16: {
        hourId = 3;
        break;
      }
      case 20: {
        hourId = 4;
        break;
      }
    }

    this.setState({
      selectedHour: this.timeShifts[hourId === 0 ? this.state.value - 1 : hourId - 1].startTime,
      value: hourId === 0 ? this.state.value : hourId,
      selectedDate: this.props.selectedDate.substring(0, 10),
    });
    let days = [];
    let wdays = ['یک شنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنج شنبه', 'جمعه', 'شنبه'];
    let months = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
    let i = 0;

    for (i = 0; i < 12; i++) {
      let today = new Date();
      if (this.h >= 22 && this.h < 24) today.setDate(today.getDate() + 1);
      today.setDate(today.getDate() + i);
      let dd = today.getDate();
      let mm = today.getMonth() + 1;
      let yyyy = today.getFullYear();
      let pDate = ConvertDate.gregorian_to_jalali(yyyy, mm, dd);
      let day = wdays[today.getDay()];
      let y = pDate.substring(5, 7);
      let gregDate = yyyy + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
      // alert(parseInt( (pDate.substring(5,2))));
      let month = months[parseInt(pDate.substring(5, 7)) - 1];

      if (gregDate === String(this.props.selectedDate).substring(0, 10)) {
        //alert('selectedDate='+String(this.props.selectedDate).substring(0,10));
        this.selectdDef = gregDate;
      } else this.selectdDef = '';

      days.push({
        persianDate: pDate,
        gregurianDate: gregDate,
        day: parseInt(pDate.substring(8, 10)),
        dayName: day,
        monthName: month,
      });
      this.days1.push(
        GeneralHelpers.toPersianNumber(day + ' ' + pDate.substring(8, 10) + ' ' + month + ' ' + pDate.substring(0, 4))
      );
      //this.days1.push(pDate);
      if (this.props.selectedDate === '' && i === (this.h >= 22 && this.h < 24 ? 0 : 1)) {
        this.props.onSelectDateTime(
          gregDate + ' ' + String(this.timeShifts[this.state.value - 1].startTime).padStart(2, '0') + ':00',
          this.props.questionId
        );
        this.setState({ selectdDate: gregDate });
      }
    }

    this.setState({ days: days });
  }

  onSelectCallBack(i, opType) {
    switch (opType) {
      case 1: {
        this.setState({ value: parseInt(this.q), selectedHour: this.timeShifts[this.q - 1].startTime });
        if (this.state.days.length > 0) {
          if (i >= 0) {
            this.selectdDef = this.state.days[i].gregurianDate;
            this.setState({ selectedDate: this.state.days[i].gregurianDate });
            this.props.onSelectDateTime(
              this.state.days[i].gregurianDate + ' ' + String(this.timeShifts[this.q - 1].startTime).padStart(2, '0') + ':00',
              this.props.questionId
            );
          }
        }
        break;
      }
      case 2: {
        let today = new Date();
        let now =
          today.getFullYear() +
          '/' +
          String(today.getMonth() + 1).padStart(2, '0') +
          '/' +
          String(today.getDate()).padStart(2, '0');
        if (this.props.selectedDate.substring(0, 10) === now && i < this.q) return;
        if (i > 0) {
          this.setState({ value: i, selectedHour: this.timeShifts[i - 1].startTime });
          //console.log(this.state.value);
          if (this.state.selectedDate !== '' || this.props.selectdDate !== '')
            this.props.onSelectDateTime(
              (this.state.selectedDate !== '' ? this.state.selectedDate : this.props.selectedDate.substring(0, 10)) +
                ' ' +
                String(this.timeShifts[i - 1].startTime).padStart(2, '0') +
                ':00',
              this.props.questionId
            );
        }

        break;
      }
    }
  }

  getPersianIndex(value) {
    const arr = this.state.days;
    //alert(arr.length);
    let index = 0;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].gregurianDate === value) {
        index = i;
      }
    }
    return index; //to handle the case where the value doesn't exist
  }

  returnMobilePicker() {
    let valueGroups;
    let optionGroups;
    if (this.days1.length > 0) {
      valueGroups = { title: this.days1[this.getPersianIndex(String(this.props.selectedDate).substring(0, 10))] };
      optionGroups = { title: this.days1 };
      return (
        <MobilePicker
          poptionGroups={optionGroups}
          pvalueGroups={valueGroups}
          itemClickHandler={this.onSelectCallBack}
          isUrgent={this.props.isUrgent}
          isUrgentMessage={(e) => this.props.isUrgentMessage(e)}
        />
      );
    }
  }

  render() {
    return <>{this.returnMobilePicker()}</>;
  }
}

export default WeekPicker;
