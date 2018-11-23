import React, { Component } from 'react'

import PropTypes from "prop-types";

import Registry from '../../helpers/registry/Registry'
import Link from '../../components/links/Link'
import CreateLink from '../../components/links/CreateLink'
import DateHelper from '../../helpers/DateHelper'

export default class LinkViewPort extends Component {

	static propTypes = {
		dataViewPort: PropTypes.instanceOf(global.HTMLDivElement).isRequired,
	}

	constructor(props) {
		super(props);
		this.cache = [];
		this.state = { links: [], data: [], selectedItem: null }
	}

	renderLink(startItem, endItem, link, key) {

		let startPosition = this.getItemPosition(startItem.index, startItem.item.end)
		let endPosition = this.getItemPosition(endItem.index, endItem.item.start)
		return <Link key={key}
			item={link}
			start={{ x: startPosition.x, y: startPosition.y }}
			end={{ x: endPosition.x, y: endPosition.y }}
			isSelected={this.props.selectedItem == link}
			onSelectItem={this.props.onSelectItem} />
	}

	getItemPosition = (index, date) => {
		let x = DateHelper.dateToPixel(date, 0, this.props.dayWidth)
		let y = index * this.props.itemheight + this.props.itemheight / 2
		return { x: x, y: y }
	}


	renderLinks() {
		this.cache = [];
		let renderLinks = {};
		let startItem, endItem = {}
		if (this.state.data.length == 0)
			return;
		for (let i = 0; i < this.state.links.length; i++) {
			let link = this.state.links[i];
			if (!link)
				if (renderLinks[link.id])
					continue;
			startItem = Registry.getTask(link.start)
			if (!startItem) {
				this.cache.push(null)
				continue
			}
			endItem = Registry.getTask(link.end)
			if (!endItem) {
				this.cache.push(null)
				continue
			}

			this.cache.push(this.renderLink(startItem, endItem, link, i))
			renderLinks[link.id] = ""

		}
	}

	// refreshData() {
	// 	if (this.props.links != this.state.links ||
	// 		this.props.data != this.state.data
	// 		|| this.props.dayWidth != this.state.dayWidth
	// 		|| this.props.selectedItem != this.state.selectedItem
	// 	) {
	// 		this.state.selectedItem = this.props.selectedItem
	// 		this.state.dayWidth = this.props.dayWidth;
	// 		this.state.links = this.props.links
	// 		this.state.data = this.props.data

	// 		if (this.state.links && this.state.data) {
	// 			this.renderLinks();
	// 		}
	// 	}  
	// }


	renderCreateLink = () => {

		console.log("ToDo renderCreateLink", this.props.taskToCreate);

		return;

		if (this.props.interactiveMode) {
			let record = Registry.getTask(this.props.taskToCreate.task.id)
			let position = this.getItemPosition(record.index, record.item.end)
			return <CreateLink start={position} onFinishCreateLink={this.props.onFinishCreateLink} />
		}
	}

	renderChangingTaskLinks = () => {
		if (this.props.changingTask != this.state.changingTask) {
			this.state.changingTask = this.props.changingTask;
			//Get Links from task
			let links = Registry.getLinks(this.state.changingTask.item.id);
			if (!links)
				return
			let item = null
			let startItem = null
			let endItem = null;
			let startPosition = {}
			let endPosition = {}
			for (let i = 0; i < links.length; i++) {
				item = links[i];
				startItem = Registry.getTask(item.link.start)
				if (!startItem)
					continue
				endItem = Registry.getTask(item.link.end)
				if (!endItem)
					continue
				startPosition = this.getItemPosition(startItem.index, startItem.item.end)
				if (this.state.changingTask.item.id == item.link.start)
					startPosition.x = this.state.changingTask.position.end;
				endPosition = this.getItemPosition(endItem.index, endItem.item.start)
				if (this.state.changingTask.item.id == item.link.end)
					endPosition.x = this.state.changingTask.position.start;

				this.cache[item.index] = (<Link key={-i - 1}
					item={item}
					start={{
						x: startPosition.x,
						y: startPosition.y,
					}}
					end={{
						x: endPosition.x,
						y: endPosition.y,
					}}
					isSelected={this.props.selectedItem == item}
					onSelectItem={this.props.onSelectItem} />)
				this.cache = [...this.cache];

			}
		}
		// console.log("links this.cache", this.cache);
	}


	getLinks() {

		// 		this.state.links = this.props.links
		// 		this.state.data = this.props.data

		let output = []

		const {
			links,
			data,
		} = this.props;

		if (!links || !data) {
			return;
		}

		console.log("getLinks links", links);
		// console.log("getLinks data", data);

		const portal = this.getPortal();

		if (!portal) {
			return;
		}

		const scrollLeft = portal.scrollLeft;

		// console.log("getLinks portal", portal);

		links.map((n) => {

			// console.log("getLinks link", n);

			const {
				id,
				start,
				end,
			} = n;

			// Получаем ноды

			const startNode = portal.querySelector(`[data-id="${start}"] [data-type="link-start"]`);
			const endNode = portal.querySelector(`[data-id="${end}"] [data-type="link-end"]`);

			if (!startNode) {
				return;
			}
			// console.log("getLinks startNode", start, startNode);
			if (!endNode) {
				return;
			}

			// console.log("getLinks endNode", end, endNode);

			// Получаем расположение блоков
			// const startPosition = startNode.getBoundingClientRect();
			// const endPosition = endNode.getBoundingClientRect();

			// console.log("getLinks startPosition", start, startPosition);
			// console.log("getLinks endPosition", end, endPosition);

			// Надо подсчитать x относительно портала
			let yStart = 6;

			let parent = startNode;
			let xStart = startNode.offsetParent.offsetLeft + startNode.offsetLeft;

			let xEnd = endNode.offsetParent.offsetLeft;

			while (parent = parent.offsetParent) {

				if (parent === portal) {
					break;
				}

				yStart += parent.offsetTop;
			}


			let yEnd = 6;
			let endParent = endNode;

			while (endParent = endParent.offsetParent) {

				if (endParent === portal) {
					break;
				}

				yEnd += endParent.offsetTop;
			}

			// console.log("getLinks coords, xStart, yStart", scrollLeft, xStart, yStart);


			// let {
			// 	x: xStart,
			// 	// y: yStart,
			// } = startPosition;

			// let {
			// 	// x: xEnd,
			// 	y: yEnd,
			// } = endPosition;

			output.push(<Link
				key={`${start}-${end}-${id}`}
				// item={item}
				start={{
					x: xStart + 5,
					y: yStart,
				}}
				end={{
					x: xEnd - 4,
					y: yEnd,
				}}
			// isSelected={this.props.selectedItem == item}
			// onSelectItem={this.props.onSelectItem}

			/>);

		});

		return output;
	}


	getPortal() {

		const {
			dataViewPort,
		} = this.props;

		return dataViewPort;
	}

	render() {
		// this.refreshData();
		// this.renderChangingTaskLinks()

		// this.refreshData();

		let links = this.getLinks();

		// console.log("render links", links);

		return (<svg
			x={0}
			y={0}
			width="100%"
			pointerEvents="none"
			style={{
				position: 'absolute',
				// top: 60,
				top: 0,
				bottom: 0,
				left: 0,
				right: 0,
				userSelect: 'none',
				height: '100%',
				// background: "rgba(0, 255, 0, 0.4)",
			}}
		>
			<defs>
				<marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="9" markerHeight="9"
					orient="auto-start-reverse">
					<path d="M 0 0 L 10 5 L 0 10 z" strokeLinejoin="round" />
				</marker>
			</defs>
			<g
			// transform={`matrix(1,0,0,1,${-(this.props.scrollLeft - this.props.nowposition)},${-this.props.scrollTop})`}
			>
				{links}
				{this.renderCreateLink()}
			</g>
		</svg>)
	}
}