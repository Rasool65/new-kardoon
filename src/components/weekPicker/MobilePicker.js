import React, { Component } from 'react';
import Picker from 'react-mobile-picker';

class MobilePicker extends Component {
  constructor(props) {
    super(props);
    const { poptionGroups, pvalueGroups } = this.props;
    this.state = {
      valueGroups: pvalueGroups, //{title: '1'},
      optionGroups: poptionGroups, //{ title: ['1', '2', '3', '4','5', '6', '7', '8','9', '10', '11', '12'] }
      //  valueGroups: this.props.valueGroups,
      //  optionGroups=this.props.optionGroups
    };
  }

  // Update the value in response to user picking event
  handleChange = (name, value) => {
    if (this.props.isUrgent) {
      this.props.isUrgentMessage();
    } else {
      this.props.itemClickHandler(this.getIndex(value), 1);

      this.setState(({ valueGroups }) => ({
        valueGroups: {
          ...valueGroups,
          [name]: value,
        },
      }));
    }
  };

  getIndex(value) {
    const arr = this.state.optionGroups.title;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === value) {
        return i;
      }
    }
    return -1; //to handle the case where the value doesn't exist
  }

  render() {
    const { optionGroups, valueGroups } = this.state;
    return <Picker optionGroups={optionGroups} valueGroups={valueGroups} onChange={this.handleChange} />;
  }
}

export default MobilePicker;
