//core modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule,HttpClientXsrfModule} from "@angular/common/http";
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


//ngx bootstrap components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AlertModule } from 'ngx-bootstrap/alert';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { DatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
// import { DatetimePopupModule } from 'ngx-bootstrap-datetime-popup';


//angular material components



//components
import { AppComponent } from './app.component';
import { NavbarComponent } from './general/navbar/navbar.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignUpCustomerComponent } from './sign-up-customer/sign-up-customer.component';
import { NotificationErrorAlertComponent } from './general/notification-error-alert/notification-error-alert.component';
import { LogoutComponent } from './logout/logout.component';
import { ErrorPageComponent } from './general/error-page/error-page.component';
import { PageNotFoundComponent} from './general/page-not-found/page-not-found.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AppParentContainerComponent } from './app-parent-container/app-parent-container.component';
import { UserEmailComponent } from './forgot-password/user-email/user-email.component';
import { UserNumberComponent } from './forgot-password/user-number/user-number.component';
import { UnableToRecoverComponent } from './forgot-password/unable-to-recover/unable-to-recover.component';
import { PasswordUpdateComponent } from './forgot-password/password-update/password-update.component';
import { RememberOldPasswordComponent } from './forgot-password/remember-old-password/remember-old-password.component';
import { AboutComponent } from './about/about.component';
import {CustomerHomepageComponent} from './customer/customer-homepage/customer-homepage.component'
// import {TermsConditionsComponent} from './terms-conditions/terms-conditions.component'
// import {UserAccountSettingsComponent} from './user-account-settings/user-account-settings.component'

//modules
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
//import { CustomFormsModule } from 'ng4-validators';
import {SharedModule} from "./shared/shared.module";
import {SharedMaterialModule} from "./shared/shared-material.module"
import {AppRoutingModule} from "./app-routing.module";
import {CoreModule} from "./core.module";
import {ClickOutsideModule } from 'ng-click-outside';

@NgModule({
	declarations: [
	 	AppComponent,
	 	NavbarComponent,
	 	SignInComponent,
		SignUpComponent,
		SignUpCustomerComponent,
		LogoutComponent,
		NotificationErrorAlertComponent,
		ErrorPageComponent,
		PageNotFoundComponent,
		ForgotPasswordComponent,
		AppParentContainerComponent,
		UserEmailComponent,
		UserNumberComponent,
		UnableToRecoverComponent,
		PasswordUpdateComponent,
		RememberOldPasswordComponent,
		AboutComponent,
		CustomerHomepageComponent,
		// TermsConditionsComponent,
		
		// UserAccountSettingsComponent
	],
	imports: [
		LoadingBarRouterModule,
		BrowserModule,
		HttpClientModule,
		BrowserAnimationsModule,
		//CUSTOM TOKEN AND HEADER TO USE FOR CSRF(XSRF) PREVENTION
		HttpClientXsrfModule.withOptions({
			cookieName: 'AITPROJECT-XSRF-TOKEN',
			headerName: 'X-AITPROJECT-XSRF-TOKEN',
		}),
		//CustomFormsModule,
		LoadingBarHttpClientModule,
 		AppRoutingModule,
		BsDropdownModule.forRoot(),
		CollapseModule.forRoot(),
		AlertModule.forRoot(),
		PopoverModule.forRoot(),
		ClickOutsideModule,
		CoreModule,
		SharedModule,
		SharedMaterialModule,
		ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production }),
		ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
		ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),

		//angular material
		
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
