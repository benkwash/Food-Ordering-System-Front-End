 import {NgModule} from '@angular/core';
import {Routes, RouterModule,PreloadAllModules} from "@angular/router";

//components
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignUpCustomerComponent } from './sign-up-customer/sign-up-customer.component';
import {LogoutComponent} from "./logout/logout.component";
import {ForgotPasswordComponent} from "./forgot-password/forgot-password.component";
import {AppParentContainerComponent} from "./app-parent-container/app-parent-container.component";
import {UserEmailComponent} from "./forgot-password/user-email/user-email.component";
import {UserNumberComponent} from "./forgot-password/user-number/user-number.component";
import {UnableToRecoverComponent} from "./forgot-password/unable-to-recover/unable-to-recover.component";
import {PasswordUpdateComponent} from "./forgot-password/password-update/password-update.component";
import {RememberOldPasswordComponent} from "./forgot-password/remember-old-password/remember-old-password.component";
import { ErrorPageComponent } from './general/error-page/error-page.component';
import { PageNotFoundComponent} from './general/page-not-found/page-not-found.component';
import {AboutComponent} from "./about/about.component";
import {ContactComponent} from "./contact/contact.component";
import {CustomerHomepageComponent} from './customer/customer-homepage/customer-homepage.component';


//define app routes
const appRoutes: Routes = [
	{
		path:'', component:AppParentContainerComponent,children:
		[
			{path:'',component:CustomerHomepageComponent,data:{title:"Home | comeCho"}},
			{path:'homepage',component:CustomerHomepageComponent,data:{title:"Home"}},
			{path:'signIn',component:SignInComponent,data:{title:"Login"}},
			{path:'signUp',component:SignUpComponent,data:{title:"Sign Up"}},
			{path:'signupcustomer',component:SignUpCustomerComponent,data:{title:"Sign Up"}},
			{path:'about',component:AboutComponent,data:{title:"About comeCho"}},
			{path:'contact',component:ContactComponent,data:{title:"Contact Us"}},
			{path:'logout',component:LogoutComponent,data:{title:"Logout"}},
			{path:'account',component:ForgotPasswordComponent,data:{title:"Account Recovery"}},
			{path:'account/recover',children:
				[
					{path:'email',component:UserEmailComponent,data:{title:"Account Recovery | email"}},
					{path:'number',component:UserNumberComponent,data:{title:"Account Recovery | number"}},
					{path:'old_password',component: RememberOldPasswordComponent,data:{title:"Account Recovery | old password"}},
					{path:'new_password',component: PasswordUpdateComponent,data:{title:"Account Recovery | new password"}},
					{path:'failed',component: UnableToRecoverComponent,data:{title:"Account Recovery | failed"}}
				]
			},
		]
	},
	{
		//to prevent the use of appParentContainerComponent, we put in new route path config
		//separating it from the main app-components using app-parent-container
		path:'restaurant',children:
		[
			
			{
				//load administrator module lazily
				path:'admin',
				loadChildren:()=>import('./administrator/administrator.module').then(m=>m.AdministratorModule)
			},
			{
				//load administrator module lazily
				path:'staff',
				loadChildren:()=>import('./restaurant-staff/restaurant-staff.module').then(m=>m.RestaurantStaffModule)
			},
			// :restaurant will be empty for the default(main or first route)
			{path:'error',component:ErrorPageComponent,data:{title:"comeCho ERROR"}},
			{ path: '**', component: PageNotFoundComponent,data:{title:"comeCho NOT FOUND"}}
		]
	},
	// () => import('./customers/customers.module').then(m => m.CustomersModule)
	{	
		path:'customer',
		loadChildren:()=>import('./customer/customer.module').then(m=>m.CustomerModule)
	}
];

@NgModule({
	imports: [
		RouterModule.forRoot(appRoutes)
	],
	exports:[RouterModule]
})

export class AppRoutingModule {}
