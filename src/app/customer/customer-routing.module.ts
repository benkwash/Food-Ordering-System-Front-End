import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//components
import {CustomerParentContainerComponent} from "./customer-parent-container/customer-parent-container.component";
import {AllrestaurantsComponent} from './allrestaurants/allrestaurant.component';
import {RestaurantMenuComponent} from './restaurant-menu/restaurant-menu.component';
import {OrdersComponent} from './orders/orders.component'


//services
import {CustomerAuthGuardService} from "./services/other/customer-auth-guard.service";
import {UserAccountSettingsResolverService} from "../services/other/user-account-settings-resolver.service";
import { ErrorPageComponent } from '../general/error-page/error-page.component';
import { PageNotFoundComponent} from '../general/page-not-found/page-not-found.component';

//modules
import {UserAccountSettingsComponent} from "../user-account-settings/user-account-settings.component";
import {ContactComponent} from "../contact/contact.component";

const routes: Routes = [
	{path:'',component:CustomerParentContainerComponent,
		children:
		[
			{path:'',redirectTo:'myorders',pathMatch:'full'},
			{
				path:'restaurants',component:AllrestaurantsComponent,data:{title:"Restaurants"}
			},{
				path:'restaurantmenu',component:RestaurantMenuComponent,data:{title:"Restuarant Menu"}
			},
			{
				path:'myorders',component:OrdersComponent,data:{title:"My orders"}
			},
			{
				path:'account',component:UserAccountSettingsComponent,
				canActivate:[CustomerAuthGuardService],
				data:{title:"Account Settings"},
				resolve:{recoveryOptions:UserAccountSettingsResolverService}
			},
			{path:'contact',component:ContactComponent,data:{title:"Contact Us"}
			},
			{path:'error',component:ErrorPageComponent,data:{title:"comeCho| ERROR"}},
			{ path: '**', component: PageNotFoundComponent,data:{title:"comeCho | NOT FOUND"}}
			
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
	providers:[CustomerAuthGuardService]
})
export class CustomerRountingModule { }
