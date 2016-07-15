
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link, browserHistory } from 'react-router';

import { Icon, Cell, Calendar } from '../../components';

import '../../styles/index.scss';

class Page2 extends Component {

	constructor(props) {
    super(props);
    this.state = {
    	date: "",
      visible: false
    };
  }

  render() {
    return (
      <div>
      	<Cell type="link" title={this.state.date} icon={<img src="https://weui.io/images/icon_nav_cell.png" />} onClick={() => this.setState({visible: true})} />
      	<Calendar
          visible={this.state.visible}
          style={{display: 'inline-block', 'lineHeight': '30px', width: '100%'}}
          value={this.state.date}
          min={'2016-02-02'}
          max={'2016-12-21'}
          disabledDates={['2016-02-12','2016-02-13','2016-02-14', '2016-03-12','2016-03-13']}
          disabledText={'暂停'}
          onChange={(date) => {
            this.setState({date,visible: false});
          }}
        />
        <Cell type="link" title="Cell" icon={<img src="https://weui.io/images/icon_nav_cell.png" />} onClick={() => browserHistory.push('/cell')} />
      </div>
    );
  }
}

export default Page2;