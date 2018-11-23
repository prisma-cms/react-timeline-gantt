import React, { Component } from 'react'

import PropTypes from "prop-types";

import { DATA_CONTAINER_WIDTH } from '../../Const'
import DataTask from '../../components/viewport/DataTask'
import DateHelper from '../../helpers/DateHelper'
import sizeMe from 'react-sizeme'
import Config from '../../helpers/config/Config'

export class DataRow extends Component {

	constructor(props) {
		super(props);

	}
	render() {
		return (
			<div className="timeLine-main-data-row"
				style={{
					...Config.values.dataViewPort.rows.style,
					// top: this.props.top,
					// height: this.props.itemheight,
				}}>
				{this.props.children}
			</div>)
	}
}

export class DataViewPort extends Component {

	static propTypes = {
		LinkViewPort: PropTypes.func.isRequired,
		DataTask: PropTypes.func.isRequired,
	}

	static defaultProps = {
		DataTask,
	}

	constructor(props) {
		super(props)
		this.childDragging = false
	}
	getContainerHeight(rows) {
		let new_height = rows > 0 ? rows * this.props.itemheight : 10;
		return new_height
	}
	onChildDrag = (dragging) => {
		this.childDragging = dragging;
	}

	// calculatePosition=(item)=>{
	//     let new_position=DateHelper.dateToPixel(item.start,this.props.nowposition,this.props.dayWidth);
	//     let new_width=DateHelper.dateToPixel(item.end,this.props.nowposition,this.props.dayWidth)-new_position;
	//     //Checking start
	//     if (new_position<this.props.boundaries.lower){
	//         if (new_position+new_width<this.props.boundaries.lower){
	//             //no in visible space
	//             return({left:0,width:0})
	//         }
	//         else{
	//             new_position=this.props.boundaries.lower-12;
	//         }
	//     }
	//     if (new_position>this.props.boundaries.upper){
	//             return({left:0,width:0})
	//     }
	//     if (new_position>this.props.boundaries.upper){
	//         return({left:0,width:0})
	//     }else{
	//     }
	// }

	renderRows = () => {
		let result = [];

		const {
			data,
			DataTask,
		} = this.props;

		// for (let i = this.props.startRow; i < this.props.endRow + 1; i++) {
		data.map((item, i) => {
			if (!item) return;
			//FIXME PAINT IN BOUNDARIES

			let new_position = DateHelper.dateToPixel(item.start, this.props.nowposition, this.props.dayWidth);
			let new_width = DateHelper.dateToPixel(item.end, this.props.nowposition, this.props.dayWidth) - new_position;

			result.push(<DataRow
				key={i}
				label={item.name}
			// top={i * this.props.itemheight} 
			// left={20} 
			// itemheight={this.props.itemheight}
			>
				<DataTask item={item} label={item.name}
					nowposition={this.props.nowposition}
					dayWidth={this.props.dayWidth}
					color={item.color}
					left={new_position}
					width={new_width}
					// height={this.props.itemheight}
					onChildDrag={this.onChildDrag}
					isSelected={this.props.selectedItem == item}
					onSelectItem={this.props.onSelectItem}
					onStartCreateLink={this.props.onStartCreateLink}
					onFinishCreateLink={this.props.onFinishCreateLink}
					onTaskChanging={this.props.onTaskChanging}
					onUpdateTask={this.props.onUpdateTask}> </DataTask>
			</DataRow>);

		})
		return result;
	}

	doMouseDown = (e) => {
		if ((e.button === 0) && (!this.childDragging)) {
			this.props.onMouseDown(e)
		}
	}
	doMouseMove = (e) => {
		this.props.onMouseMove(e, this.dataViewPort)
	}

	doTouchStart = (e) => {
		if (!this.childDragging) {
			this.props.onTouchStart(e)
		}
	}
	doTouchMove = (e) => {
		this.props.onTouchMove(e, this.dataViewPort)
	}

	componentDidMount() {
		this.dataViewPort.scrollLeft = 0;
	}

	render() {

		const {
			LinkViewPort,
			...other
		} = this.props;

		if (this.dataViewPort) {
			this.dataViewPort.scrollLeft = this.props.scrollLeft;
			this.dataViewPort.scrollTop = this.props.scrollTop;
		}

		// let height = this.getContainerHeight(this.props.data.length)
		return (
			<div
				// ref="dataViewPort"
				ref={el => this.dataViewPort = el}
				id="timeLinedataViewPort"
				className="timeLine-main-data-viewPort"
				onMouseDown={this.doMouseDown}
				onMouseMove={this.doMouseMove}
				onMouseUp={this.props.onMouseUp}
				onMouseLeave={this.props.onMouseLeave}
				onTouchStart={this.doTouchStart}
				onTouchMove={this.doTouchMove}
				onTouchEnd={this.props.onTouchEnd}
				onTouchCancel={this.props.onTouchCancel}
			>

				<div
					className="timeLine-main-data-container"
					style={{
						// height: height,
						width: DATA_CONTAINER_WIDTH,
						maxWidth: DATA_CONTAINER_WIDTH
						// height: "100%",
						// width: "100%",
					}}
				>

					{this.renderRows()}
					
					{this.dataViewPort ?
						<LinkViewPort
							{...other}
							dataViewPort={this.dataViewPort}
						/> : null
					}
					
				</div>


			</div>)
	}
}

export default sizeMe({ monitorWidth: true, monitorHeight: true })(DataViewPort)
