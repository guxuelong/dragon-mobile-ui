
import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import Format from '../utils/format';

const CALENDAR_ROW_COUNT = 8,
      CALENDAR_COL_COUNT = 7;

class CalendarBody extends Component {

  constructor(props) {
    super(props);
    this.state = {
      min: props.min,
      max: props.max,
      value: props.value,
      disabledDates: props.disabledDates,
      disabledText: props.disabledText
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      min: nextProps.min,
      max: nextProps.max,
      value: nextProps.value,
      disabledDates: nextProps.disabledDates,
      disabledText: nextProps.disabledText
    });
  }

  render() {
    const { visible } = this.props;
    const style = {
      display: visible ? 'none' : 'block'
    }

    return (
      <div style={style}>
        {this.renderCurrentDate()}
      </div>
    );
  }
  // 从最小日期开始渲染
  renderCurrentDate() {
    var html = [];
    let dd = new Date(this.state.min),
    current = {
      year : dd.getFullYear(),
      month: dd.getMonth() + 1
    };
    let disabledDates = [...this.state.disabledDates];
        disabledDates = disabledDates.map(value => Format.date(value, 'yyyy/M/d'));
    let max = new Date(this.state.max);
    html.push(this.renderDate(current,disabledDates))
    for (var i = 0 ; i < 999; i++) {
      if (current.year == max.getFullYear() && current.month == max.getMonth() + 1) {
        break;
      }
      current = this.getNextMonth(current);
      html.push(this.renderDate(current,disabledDates));
    }
    return html;
  }

  // 渲染日期
  renderDate(current,disabledDates) {

    let pre = this.getPreMonth(current),
        next = this.getNextMonth(current);
    current.days = this.getDays(current);
    current.firstDayOfWeek = this.getFirstDayOfWeek(current);
    pre.days = this.getDays(pre);
    let calendarRowCount = CALENDAR_ROW_COUNT;
    let dates = [];

    if (current.firstDayOfWeek == 6 || current.firstDayOfWeek == 7) {
      calendarRowCount++;
    }

    // 当月第一天不在周一时，前面日期用上个月的日期补齐
    for (let i = pre.days; i > pre.days - current.firstDayOfWeek + 1; i--) {
      dates.unshift(this.renderDateCell({
        year : pre.year,
        month: pre.month,
        date : i
      }, 'others'));
    }

    // 当月日期
    for (let j = 1; j <= current.days; j++) {
      let type = 'nomal',
          max = new Date(this.state.max).getTime(),
          min = new Date(this.state.min).getTime(),
          currentDate = new Date(current.year + '/' + current.month + '/' + j).getTime();
      
      if (currentDate < min || currentDate > max) {
        type = 'disabled';
      }
      
      if (disabledDates.includes(current.year + '/' + current.month + '/' + j)) {
        type = 'full';
      }
      dates.push(this.renderDateCell({
        year : current.year,
        month: current.month,
        date : j
      }, type));
    }

    // 当月最后一天不在周日时，后面日期用下个月的日期补齐
    for (let k = 1; k <= calendarRowCount * CALENDAR_COL_COUNT  - current.days - current.firstDayOfWeek  + 1; k++) {
      dates.push(this.renderDateCell({
        year : next.year,
        month: next.month,
        date : k
      }, 'others'));
    }

    let tabelCell = [];
    for (let m = 0; m < calendarRowCount; m++) {
      let tabelRow = [];
      for (let n = 0; n < CALENDAR_COL_COUNT; n++) {
        let index = m * CALENDAR_COL_COUNT + n;
        tabelRow.push(
          <td key={`column-${n}`} className="ui-calendar-cell" role="gridcell">
            {dates[index]}
          </td>
        );
      }
      tabelCell.push(<tr key={`row-${m}`} role="row">{tabelRow}</tr>);
    }

    return (
      <article key={current.year + '' + current.month}>
        <section className="ui-calendar-title"> {current.year + '年' + current.month + '月'} </section>
        <table className="ui-calendar-table">
          <tbody>
            {tabelCell}
          </tbody>
        </table>
      </article>
    );
  }

  // 渲染日期单元
  renderDateCell(day, type) {
    const { onDateClick} = this.props,
          value = this.state.value,
          fullDay = `${day.year}/${day.month}/${day.date}`,
          displayDay = `${day.year}-${day.month}-${day.date}`;

    const cls = classnames({
      'ui-calendar-text'           : true,
      'ui-calendar-text-nomal'    : type === 'nomal',
      'ui-calendar-text-others'    : type === 'others',
      'ui-calendar-text-disabled'    : type === 'disabled',
      'ui-calendar-text-full'    : type === 'full',
      'ui-calendar-text-selected'  : value === fullDay,
    });
    if (new Date().toLocaleDateString() === new Date(fullDay).toLocaleDateString()) {
      day.date = "今天"
    }
    if (type == 'full') {
      return (
          <div title={displayDay} className={cls}>
            <div>{day.date}</div>
            <div>{this.state.disabledText || ''}</div>
          </div>)
    }
    return <div 
            className={cls} 
            title={displayDay} 
            onClick={
              () => {
                if (type == 'nomal') {
                  onDateClick(fullDay)
                }
              }
            }>{day.date}</div>;
  }

  // 获取第一天的星期
  getFirstDayOfWeek(current) {
    let date = new Date(`${current.year}/${current.month}/1`),
        week = date.getDay();
    if (week == 0) {
      week = 7;
    }
    return week;
  }

  // 获取下个月
  getNextMonth(current) {
    let result = {};
    if (current.month == 12) {
      result.year = current.year + 1;
      result.month = 1;
    } else {
      result.year = current.year;
      result.month = current.month + 1;
    }
    return result;
  }

  // 获取上个月
  getPreMonth(current) {
    let result = {};
    if (current.month == 1) {
      result.year = current.year - 1;
      result.month = 12;
    } else {
      result.year = current.year;
      result.month = current.month - 1;
    }
    return result;
  }

  // 获取指定月份的天数
  getDays(current) {
    return new Date(current.year, current.month, 0).getDate();
  }

}

CalendarBody.propTypes = {
  defaultValue: PropTypes.string,
  value       : PropTypes.string,
  min         : PropTypes.string,
  max         : PropTypes.string,
  onDateClick : PropTypes.func,
};

CalendarBody.defaultProps = {
  defaultValue: '',
  value       : '',
  min         : '',
  max         : '',
  onDateClick : () => {},
};

export default CalendarBody;