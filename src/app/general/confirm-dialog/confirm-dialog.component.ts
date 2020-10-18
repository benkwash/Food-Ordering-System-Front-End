import { Component, Inject , OnInit} from "@angular/core";

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
    selector: "app-confirm-dialog",
    templateUrl: "confirm-dialog.component.html",
    styleUrls: [
        "confirm-dialog.component.css"
    ]
})

export class ConfirmDialogComponent implements OnInit {

    confirmationMessage = "";

    constructor(
        public dialogRef: MatDialogRef<ConfirmDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.confirmationMessage = this.data.message
    }

    closeDialog(res): void {
        this.dialogRef.close({ response: res });
    }

    ngOnInit(){
        // this.dialogRef.
        // this.dialogRef.updateSize("300px","100px")
    }

}