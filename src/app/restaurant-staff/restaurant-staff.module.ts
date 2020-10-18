import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//ngx bootstrap components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';

//components
import {RestaurantStaffParentContainerComponent} from "./restaurant-staff-parent-container/restaurant-staff-parent-container.component";
import {HomepageComponent} from "./homepage/homepage.component"
import {RestaurantStaffNavbarComponent} from "./restaurant-staff-navbar/restaurant-staff-navbar.component";


///sidenav
import {StaffSidenav} from './staff-sidenav/staff-sidenav.component'

//services
import {StaffAuthGuardService} from "./services/other/staff-auth-guard.service";
import {StaffOperationsService} from './services/http/staffOperations.service'

//other modules
import { RestaurantStaffRoutingModule } from './restaurant-staff-routing.module';
import {SharedModule} from "../shared/shared.module";
import {SharedMaterialModule} from "../shared/shared-material.module"
import {ClickOutsideModule } from 'ng-click-outside';
//for navbar

@NgModule({
  	imports: [
		  //modules
    	CommonModule,
		SharedModule,
		SharedMaterialModule,
    	RestaurantStaffRoutingModule,
		BsDropdownModule.forRoot(),
		CollapseModule.forRoot(),
		ClickOutsideModule,
	],
	providers: [
		///services
		StaffAuthGuardService,
		StaffOperationsService
	],
	declarations: [
		//components
		RestaurantStaffParentContainerComponent,
		RestaurantStaffNavbarComponent,
		HomepageComponent,

		StaffSidenav
		
	]
})
export class RestaurantStaffModule { }
