import React, { Component } from 'react'
 

import ContentEditable from '../../../components/common/ContentEditable'

export class TaskRow extends Component {

  constructor(props) {
    super(props);
  }

  onChange = (value) => {
    if (this.props.onUpdateTask) {
      this.props.onUpdateTask(this.props.item, { name: value })
    }
  }

  render() {

    const {
      Config,
    } = this.props;

    return (
      <div className="timeLine-side-task-row"
        style={{ ...Config.values.taskList.task.style, top: this.props.top, height: this.props.itemheight }}
        onClick={(e) => this.props.onSelectItem(this.props.item)}>

        <ContentEditable value={this.props.label}
          index={this.props.index}
          onChange={this.onChange}

        />


      </div>)
  }
}

export default TaskRow;
