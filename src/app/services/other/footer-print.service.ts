import { Injectable } from '@angular/core';
import { Subject,Observable }    from 'rxjs';
@Injectable()
export class FooterPrintService {
	constructor(){}

  // Observable boolean sources
	//send stream to hide or disable main footer during print
	private disableMainFooterDuringPrintSub = new Subject<boolean>();

	//disable main footer during printing of page
	public disableMainFooterDuringPrint() {
		this.disableMainFooterDuringPrintSub.next(true);
	}

	//enable main footer during printing of page
	public enableMainFooterDuringPrint() {
		this.disableMainFooterDuringPrintSub.next(false);
	}

	//get main footer disable status
	public getMainFooterPrintDisableStatus():Observable<boolean> {
		return this.disableMainFooterDuringPrintSub.asObservable();
	}
}
