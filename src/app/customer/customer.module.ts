import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//ngx bootstrap components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';

//components
import {CustomerNavbarComponent} from "./customer-navbar/customer-navbar.component";
import { CustomerParentContainerComponent } from './customer-parent-container/customer-parent-container.component';
import {AllrestaurantsComponent} from './allrestaurants/allrestaurant.component'
import {RestaurantMenuComponent,RestaurantMenuDialogComponent} from './restaurant-menu/restaurant-menu.component'
import {OrdersComponent,OrdersDialogComponent,OrderDetailComponent} from './orders/orders.component'

// import {UserAccountSettingsComponent} from '../user-account-settings/user-account-settings.component'


//services
import {CustomerService} from './services/http/customer.service'

//other modules
import { CustomerRountingModule } from './customer-routing.module';
import {SharedModule} from "../shared/shared.module";
import {SharedMaterialModule} from "../shared/shared-material.module"
import {ClickOutsideModule } from 'ng-click-outside';
//for navbar

@NgModule({
  	imports: [
        CustomerRountingModule,
    	CommonModule,
		SharedModule,
		SharedMaterialModule,
    	CustomerRountingModule,
		BsDropdownModule.forRoot(),
		CollapseModule.forRoot(),
		ClickOutsideModule,
	],
	providers: [
        //services
		CustomerService
	],
	declarations: [
		//components
		// UserAccountSettingsComponent,


        CustomerNavbarComponent,        
        CustomerParentContainerComponent,
		AllrestaurantsComponent,
		RestaurantMenuComponent,RestaurantMenuDialogComponent,

		OrdersComponent,
		OrdersDialogComponent,
		OrderDetailComponent
		
		
	]
})
export class CustomerModule { }
