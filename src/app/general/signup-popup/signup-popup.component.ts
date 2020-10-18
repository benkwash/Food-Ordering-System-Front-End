import { Component,Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
    selector: "app-signup-popup",
    templateUrl: 'signup-popup.component.html',
    styleUrls: [
        "signup-popup.component.css"
    ]
})

export class SignupPopupComponent {

    constructor(
        public dialogRef: MatDialogRef<SignupPopupComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog, private router:Router) {

    }


    onLinkClick(link){
        this.router.navigate(['/'+link]);
        this.onNoClick();
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}