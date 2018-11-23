import ObjectHelper from './ObjectHelper'

import moment from "moment";

class Generator {
	constructor() {

	}
	generateData() {
		let data = [];
		let links = [];
		let now = new Date()
		let nowId = this.addRecord(now, 0, data)

		let test = new Date();
		test.setDate(test.getDate() + 3)
		test.setHours(0, 0, 0, 0);
		let tomorrowId = this.addRecord(test, 1, data)
		// this.addLink(nowId,tomorrowId,links) 

		let toDate = new Date();

		let limit = 10;

		for (let i = 1; i < limit; i++) {
			this.addRecord(
				this.randomDate(
					new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDay()),
					new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDay())),
				i, data
			)
		}

		// let start = 0;
		// let end = 0;
		// for (let i = 1; i < limit; i++) {
		// 	start = Math.trunc(Math.random() * limit)
		// 	end = Math.trunc(Math.random() * limit)

		// 	data[start] && data[end] && this.addLink(data[start].id, data[end].id, links)
		// }

		data = [
			{
				"id": "cjopkbd5a01gk09609disk7kj",
				"createdAt": "2018-11-20T09:54:30.863Z",
				"updatedAt": "2018-11-21T07:20:45.135Z",
				"name": "керекркеркер",
				"description": null,
				"content": null,
				"status": "New",
				"startDatePlaning": "2018-12-04T20:54:30.863Z",
				"endDatePlaning": null,
				"startDate": null,
				"endDate": null,
				"__typename": "Task",
				"Timers": [],
				"start": moment("2018-12-04T20:54:30.863Z"),
				"end": null
			},
			{
				"id": "cjopiax4v01er09606cweyk08",
				"createdAt": "2018-11-20T08:58:10.880Z",
				"updatedAt": "2018-11-22T20:32:00.971Z",
				"name": "Редакторyuyu6666 5675",
				"description": null,
				"status": "New",
				"startDatePlaning": "2018-12-08T11:00:00.000Z",
				"endDatePlaning": "2018-12-13T20:00:00.000Z",
				"startDate": null,
				"endDate": null,
				"__typename": "Task",
				"start": moment("2018-12-08T11:00:00.000Z"),
				"end": moment("2018-12-13T20:00:00.000Z")
			},
			{
				"id": "cjopiana701eg0960uopuhen9",
				"createdAt": "2018-11-20T08:57:58.112Z",
				"updatedAt": "2018-11-21T07:30:35.864Z",
				"name": "Планировщик yuyuyu",
				"description": null,
				"status": "New",
				"startDatePlaning": "2018-12-11T09:57:58.112Z",
				"endDatePlaning": null,
				"startDate": null,
				"endDate": null,
				"__typename": "Task",
				"Timers": [],
				"start": moment("2018-12-11T09:57:58.112Z"),
				"end": null
			},
			{
				"id": "cjopi9ank01dt0960cj3rfoin",
				"createdAt": "2018-11-20T08:56:55.089Z",
				"updatedAt": "2018-11-21T07:26:53.996Z",
				"name": "Проектирование проекта",
				"description": null,
				"content": null,
				"status": "New",
				"startDatePlaning": "2018-11-21T11:00:00.000Z",
				"endDatePlaning": "2018-12-11T11:00:00.000Z",
				"startDate": null,
				"endDate": null,
				"__typename": "Task",
				"Timers": [],
				"start": moment("2018-11-21T11:00:00.000Z"),
				"end": moment("2018-12-11T11:00:00.000Z")
			},
			{
				"id": "cjopi3ee301cq0960xsgy1wz2",
				"createdAt": "2018-11-20T08:52:19.996Z",
				"updatedAt": "2018-11-21T07:23:54.902Z",
				"name": "Задача 3",
				"description": null,
				"content": null,
				"status": "New",
				"startDatePlaning": "2018-12-03T11:52:19.996Z",
				"endDatePlaning": null,
				"startDate": null,
				"endDate": null,
				"__typename": "Task",
				"Timers": [],
				"start": moment("2018-12-03T11:52:19.996Z"),
				"end": null
			},
		]

		// links = [{ "id": "21c3f718-e89a-4219-9cc4-51ccf0366d3a", "start": "cjopiax4v01er09606cweyk08", "startPosition": 0, "end": "cjopiana701eg0960uopuhen9", "endPosition": 0 }, { "id": "98e514bf-99ab-41fb-895b-252da37e1bb5", "start": "cjopi9ank01dt0960cj3rfoin", "startPosition": 0, "end": "cjopi3ee301cq0960xsgy1wz2", "endPosition": 0 }];

		// console.log("generateData data", data);

		links = [
			{
				"start": "cjopiax4v01er09606cweyk08",
				"end": "cjopiana701eg0960uopuhen9"
			},
			{
				"start": "cjopiana701eg0960uopuhen9",
				"end": "cjopi3ee301cq0960xsgy1wz2"
			}
		];


		return { data: data, links: links };
	}

	addRecord(starDate, i, result) {
		let endDate = new Date(starDate.getTime());
		endDate.setDate(starDate.getDate() + Math.random() * 20);
		let id = ObjectHelper.genID();
		let record = { id: id, name: `Task ${i}`, start: starDate, end: endDate, color: this.getRandomColor() }
		result.push(record)
		return id;
	}

	addLink(startId, endId, list) {
		let id = ObjectHelper.genID();
		let record = { id: id, start: startId, startPosition: 1, end: endId, endPosition: 0 }
		list.push(record)
		return id;
	}

	createLink(start, end) {

		console.log("ToDo createLink", start, end);

		// return;
		return { id: ObjectHelper.genID(), start: start.task.id, startPosition: start.position, end: end.task.id, endPosition: end.position }
	}


	randomDate(start, end) {
		return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
	}

	getRandomColor() {
		var letters = '0123456789ABCDEF';
		var color = '#';
		for (var i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}
	setRandomColor() {
		// $("#colorpad").css("background-color", getRandomColor());
		const color = this.getRandomColor();
		let element = window.document.querySelector("#colorpad");

		if (element) {
			let style = element.getAttribute("style") || "";
			style = style.split(";").push(`background-color: ${color}`).join(";");
			element.setAttribute("style", style)
		}
	}
}

const instance = new Generator();
export default instance;