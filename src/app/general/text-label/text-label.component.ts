import { Component, OnInit, Input, Output, EventEmitter} from "@angular/core";

@Component({
	selector: 'app-text-label',
	templateUrl: './text-label.component.html',
	styleUrls: ['./text-label.component.css']
})
export class TextLabelComponent implements OnInit {
	@Input() text:string;
	@Output() onClose = new EventEmitter<boolean>();
	constructor() { }

	ngOnInit() {
	}

	//close label
	onClosed(){
		//emit event
		this.onClose.emit(true);
	}

}
