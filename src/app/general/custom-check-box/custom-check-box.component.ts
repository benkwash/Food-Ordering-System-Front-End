import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';

@Component({
	selector: 'app-custom-check-box',
	templateUrl: './custom-check-box.component.html',
	styleUrls: ['./custom-check-box.component.css']
})
export class CustomCheckBoxComponent implements OnInit {
	@Input('checkValue') checkValue:boolean;
	@Output() checkValueOutput = new EventEmitter<boolean>();
	constructor() { }

	ngOnInit() {}

	public onCheckBoxChange(event) {
		this.checkValueOutput.emit(event.target.checked);
	}
}
