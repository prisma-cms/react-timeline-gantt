import React, { Component } from 'react'
import PropTypes from "prop-types";
import DateHelper from '../../helpers/DateHelper'
import { MODE_NONE, MODE_MOVE, MOVE_RESIZE_LEFT, MOVE_RESIZE_RIGHT } from '../../Const'
import { LINK_POS_LEFT, LINK_POS_RIGHT } from '../../Const'
import Config from '../../helpers/config/Config'
import { withStyles } from 'material-ui';

export const styles = {
	root: {
		display: "inline-flex",
		flexDirection: "row",
		alignItems: "center",
		minWidth: 170,
		backgroundColor: "grey",
		color: "white",
		position: 'relative',
		borderRadius: 14,
	},
	selectedRoot: {
		border: 'solid 1px #ff00fa',
	},
	inner: {
		overflow: 'hidden',
		whiteSpace: "nowrap",
		margin: "0 4px",
		width: "100%",
		textAlign: "left",
	},
	leftSide: {
		// top: 0,
		position: "absolute",
		left: -4,
		// height: style.height,
	},
	rightSide: {
		// top: 0,
		// left: style.width - 3,
		position: "absolute",
		right: -4,
		// height: style.height,
	},
}

export class DataTask extends Component {


	static propTypes = {
		classes: PropTypes.object.isRequired,
		isSelected: PropTypes.bool.isRequired,
	}

	static defaultProps = {
		isSelected: false,
	}

	constructor(props) {
		super(props);
		this.calculateStyle = this.calculateStyle.bind(this)
		this.state = {
			dragging: false,
			left: this.props.left,
			width: this.props.width,
			mode: MODE_NONE
		}
	}

	onCreateLinkMouseDown = (e, position) => {
		if (e.button === 0) {
			e.stopPropagation();
			this.props.onStartCreateLink(this.props.item, position)
		}
	}
	onCreateLinkMouseUp = (e, position) => {
		e.stopPropagation();
		this.props.onFinishCreateLink(this.props.item, position)
	}
	onCreateLinkTouchStart = (e, position) => {
		e.stopPropagation();
		this.props.onStartCreateLink(this.props.item, position)
	}
	onCreateLinkTouchEnd = (e, position) => {
		e.stopPropagation();
		this.props.onFinishCreateLink(this.props.item, position)
	}

	componentDidUpdate(props, state) {
		if (this.state.dragging && !state.dragging) {
			document.addEventListener('mousemove', this.doMouseMove)
			document.addEventListener('mouseup', this.doMouseUp)
			document.addEventListener('touchmove', this.doTouchMove)
			document.addEventListener('touchend', this.doTouchEnd)
		} else if (!this.state.dragging && state.dragging) {
			document.removeEventListener('mousemove', this.doMouseMove)
			document.removeEventListener('mouseup', this.doMouseUp)
			document.removeEventListener('touchmove', this.doTouchMove)
			document.removeEventListener('touchend', this.doTouchEnd)
		}
	}

	dragStart(x, mode) {
		this.props.onChildDrag(true)
		this.draggingPosition = x;
		this.setState({
			dragging: true,
			mode: mode,
			left: this.props.left,
			width: this.props.width,
		});
	}
	dragProcess(x) {
		let delta = this.draggingPosition - x;
		let newLeft = this.state.left;
		let newWidth = this.state.width;

		switch (this.state.mode) {
			case MODE_MOVE:
				newLeft = this.state.left - delta
				break;
			case MOVE_RESIZE_LEFT:
				newLeft = this.state.left - delta;
				newWidth = this.state.width + delta;
				break;
			case MOVE_RESIZE_RIGHT:
				newWidth = this.state.width - delta;
				break;
		}
		//the coordinates need to be global
		let changeObj = { item: this.props.item, position: { start: newLeft - this.props.nowposition, end: newLeft + newWidth - this.props.nowposition } };
		this.props.onTaskChanging(changeObj);
		this.setState({ left: newLeft, width: newWidth })
		this.draggingPosition = x;
	}
	async dragEnd() {
		this.props.onChildDrag(false)
		let new_start_date = DateHelper.pixelToDate(this.state.left, this.props.nowposition, this.props.dayWidth);
		let new_end_date = DateHelper.pixelToDate(this.state.left + this.state.width, this.props.nowposition, this.props.dayWidth);

		console.log("dragEnd", new_start_date, new_end_date);
		console.log("dragEnd nowposition", this.state.left, this.props.nowposition);

		await this.props.onUpdateTask(this.props.item, { start: new_start_date, end: new_end_date })

		this.setState({ dragging: false, mode: MODE_NONE })
	}

	doMouseDown = (e, mode) => {
		if (!this.props.onUpdateTask)
			return;
		if (e.button === 0) {
			e.stopPropagation();
			this.dragStart(e.clientX, mode)
		}
	}
	doMouseMove = (e) => {
		if (this.state.dragging) {
			e.stopPropagation();
			this.dragProcess(e.clientX);
		}
	}
	doMouseUp = () => {
		this.dragEnd();
	}

	doTouchStart = (e, mode) => {
		if (!this.props.onUpdateTask)
			return;
		console.log('start')
		e.stopPropagation();
		this.dragStart(e.touches[0].clientX, mode);
	}
	doTouchMove = (e) => {
		if (this.state.dragging) {
			console.log('move')
			e.stopPropagation();
			this.dragProcess(e.changedTouches[0].clientX);
		}
	}
	doTouchEnd = (e) => {
		console.log('end')
		this.dragEnd();
	}

	calculateStyle() {
		let configStyle = this.props.isSelected ? Config.values.dataViewPort.task.selectedStyle : Config.values.dataViewPort.task.style;
		// let backgroundColor = this.props.color ? this.props.color : configStyle.backgroundColor

		let {
			left,
			width,
			height,
		} = this.props;

		if (this.state.dragging) {
			return {
				...configStyle,
				// backgroundColor: backgroundColor,
				left,
				width,
				height: height ? height - 5 : undefined,
				// top: 2,
			}
		} else {
			return {
				...configStyle,
				// backgroundColor,
				left,
				width,
				width: this.props.width,
				height: height ? height - 5 : undefined,
				// top: 2,
			}
		}

	}


	renderInner() {

		const {
			item,
		} = this.props;

		const {
			name,
		} = item;

		return Config.values.dataViewPort.task.showLabel ? name : "";
	}


	getRootClasses() {

		const {
			classes,
			isSelected,
			className,
		} = this.props;

		return [classes.root, isSelected ? classes.selectedRoot : "", className];
	}

	render() {

		let style = this.calculateStyle();

		// console.log("DataTask style", style);

		const {
			item,
			classes,
			// isSelected,
			// className,
		} = this.props;

		const {
			id,
			name,
		} = item;

		return (
			<div
				onMouseDown={(e) => this.doMouseDown(e, MODE_MOVE)}
				onTouchStart={(e) => this.doTouchStart(e, MODE_MOVE)}
				onClick={(e) => { this.props.onSelectItem(item) }}
				style={{
					...style,
				}}
				data-id={id}
				className={this.getRootClasses().join(" ")}
			>
				<div
					className="timeLine-main-data-task-side"
					className={classes.leftSide}
					onMouseDown={(e) => this.doMouseDown(e, MOVE_RESIZE_LEFT)}
					onTouchStart={(e) => this.doTouchStart(e, MOVE_RESIZE_LEFT)}
					data-type="link-end"
				>
					<div
						className="timeLine-main-data-task-side-linker"
						onMouseUp={(e) => this.onCreateLinkMouseUp(e, LINK_POS_LEFT)}
						onTouchEnd={(e) => this.onCreateLinkTouchEnd(e, LINK_POS_LEFT)}
					/>
				</div>
				<div
					className={classes.inner}
				>
					{this.renderInner()}
				</div>
				<div className="timeLine-main-data-task-side"
					className={classes.rightSide}
					onMouseDown={(e) => this.doMouseDown(e, MOVE_RESIZE_RIGHT)}
					onTouchStart={(e) => this.doTouchStart(e, MOVE_RESIZE_RIGHT)}
					data-type="link-start"
				>
					<div
						className="timeLine-main-data-task-side-linker"
						onMouseDown={(e) => this.onCreateLinkMouseDown(e, LINK_POS_RIGHT)}
						onTouchStart={(e) => this.onCreateLinkTouchStart(e, LINK_POS_RIGHT)}
					/>
				</div>
			</div>)

	}
}

export default withStyles(styles)(DataTask);
