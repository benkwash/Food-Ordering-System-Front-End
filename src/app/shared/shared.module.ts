import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

//components
import { LongFooterComponent } from '../general/long-footer/long-footer.component';
import { ShortFooterComponent } from '../general/short-footer/short-footer.component';
import { ErrorPopoverComponent } from '../general/error-popover/error-popover.component';
import { ErrorAlertComponent } from "../general/error-alert/error-alert.component";
import { ConfirmAlertComponent } from '../general/confirm-alert/confirm-alert.component';
import { SuccessAlertComponent } from '../general/success-alert/success-alert.component';
import { TextLabelComponent } from '../general/text-label/text-label.component';
import { StatusAlertComponent } from '../general/status-alert/status-alert.component';
import { UserAccountSettingsComponent } from "../user-account-settings/user-account-settings.component";
import { PasswordSetRetrievalComponent } from '../general/password-set-retrieval/password-set-retrieval.component';
import { CustomCheckBoxComponent } from '../general/custom-check-box/custom-check-box.component';
import { TermsConditionsComponent } from "../terms-conditions/terms-conditions.component";
import { ContactComponent } from "../contact/contact.component";
import { ConfirmDialogComponent } from '../general/confirm-dialog/confirm-dialog.component';
import {SignupPopupComponent} from "../general/signup-popup/signup-popup.component";

import {AddButtonComponent} from "../general/add-button/add-button.component"

//ngx bootstrap components
import { ModalModule } from 'ngx-bootstrap/modal';
import { AlertModule } from 'ngx-bootstrap/alert';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';

// //directives
// import {CustomMaxDirective} from "../directives/custom-max.directive";
// import {CustomMinDirective} from "../directives/custom-min.directive";

//modules
import { NgSelectModule } from '@ng-select/ng-select';
//import { UiSwitchModule } from 'ngx-ui-switch';
import { PrintableSharedModule } from "./printable-shared.module";
import {SharedMaterialModule} from "./shared-material.module"

@NgModule({
	declarations: [
		ConfirmDialogComponent,
		LongFooterComponent,
		ShortFooterComponent,
		ErrorPopoverComponent,
		ErrorAlertComponent,
		ConfirmAlertComponent,
		SuccessAlertComponent,
		TextLabelComponent,
		StatusAlertComponent,
		//   	CustomMinDirective,
		//   	CustomMaxDirective,
		UserAccountSettingsComponent,
		ContactComponent,
		TermsConditionsComponent,
		PasswordSetRetrievalComponent,
		CustomCheckBoxComponent,
		SignupPopupComponent,
		AddButtonComponent
	],
	imports: [
		CommonModule,
		ModalModule.forRoot(),
		AlertModule.forRoot(),
		PopoverModule.forRoot(),
		FormsModule,
		NgSelectModule,
		TooltipModule.forRoot(),
		BsDropdownModule.forRoot(),
		CollapseModule.forRoot(),
		AccordionModule.forRoot(),
		ProgressbarModule.forRoot(),
		RouterModule,
		PrintableSharedModule,
		SharedMaterialModule
	],
	exports: [
		ConfirmDialogComponent,
		CommonModule,
		LongFooterComponent,
		ShortFooterComponent,
		ErrorPopoverComponent,
		ErrorAlertComponent,
		ConfirmAlertComponent,
		SuccessAlertComponent,
		TextLabelComponent,
		StatusAlertComponent,
		FormsModule,
		ReactiveFormsModule,
		NgSelectModule,
		// UiSwitchModule,
		RouterModule,
		// CustomMinDirective,
		// CustomMaxDirective,
		UserAccountSettingsComponent,
		ContactComponent,
		TermsConditionsComponent,
		PasswordSetRetrievalComponent,
		CustomCheckBoxComponent,
		SignupPopupComponent,
		AddButtonComponent
	],
	providers: []
})

export class SharedModule { }
