import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import Format from '../utils/format';
import CalendarHeader from './CalendarHeader';
import CalendarBody from './CalendarBody';

class Calendar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value  : Format.date(props.value || props.defaultValue, 'yyyy/M/d'),
      min: Format.date(props.min, 'yyyy/M/d'),
      max: Format.date(props.max, 'yyyy/M/d'),
      disabledDates: props.disabledDates,
      disabledText: props.disabledText,
      visible: props.visible,
    };
  }

  componentWillReceiveProps(nextProps) {
      this.setState({
        value  : Format.date(nextProps.value || nextProps.defaultValue, 'yyyy/M/d'),
        min: Format.date(nextProps.min, 'yyyy/M/d'),
        max: Format.date(nextProps.max, 'yyyy/M/d'),
        disabledDates: nextProps.disabledDates,
        disabledText: nextProps.disabledText,
        visible: nextProps.visible,
      });
  }

  render () {
    const props = this.props;
    const { className, hasFooter, ...others } = props;
    const { value, min, max, visible, disabledDates, disabledText } = this.state;
    const cls = classnames({
      'ui-calendar': true,
      [className]  : !!className,
    });
    return (
      <article style={{display: (visible ? 'block' : 'none')}}className="ui-calendar">
        <section className="ui-calendar-header">
          <table>
            <thead>
              <tr>
                <th title={`星期一`}>一</th>
                <th title={`星期二`}>二</th>
                <th title={`星期三`}>三</th>
                <th title={`星期四`}>四</th>
                <th title={`星期五`}>五</th>
                <th className="week-color" title={`星期六`}>六</th>
                <th className="week-color" title={`星期日`}>日</th>
              </tr>
            </thead>
          </table>
        </section>
        <section className="ui-calendar-body">
          <CalendarBody value={value} min={min} max={max} disabledDates={disabledDates} disabledText={disabledText} onDateClick={(value) => this.onDateClick(value)}/>
        </section>
      </article>
    );
  }

  onDateClick(value) {
    // this.setState({
    //   value  : value,
    // });
    const { format, onChange } = this.props;
    onChange && onChange(Format.date(value, format));
  }
}

Calendar.propTypes = {
  format  : PropTypes.string,
  onChange: PropTypes.func,
};

Calendar.defaultProps = {
  format  : 'yyyy-MM-dd',
  onChange: () => {},
  disabledDates: []
};

export default Calendar;