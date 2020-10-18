import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//components
import {HomepageComponent} from "./homepage/homepage.component"
import {RestaurantStaffParentContainerComponent} from "./restaurant-staff-parent-container/restaurant-staff-parent-container.component"

//services
import {StaffAuthGuardService} from "./services/other/staff-auth-guard.service";
import {UserAccountSettingsResolverService} from "../services/other/user-account-settings-resolver.service";

//components

//modules
import {UserAccountSettingsComponent} from "../user-account-settings/user-account-settings.component";
import { resolve } from 'url';

const routes: Routes = [
	{path:'',component:RestaurantStaffParentContainerComponent,canActivate:[StaffAuthGuardService],
		// resolve:{data:AdminPageResolverService},
		children:
		[
			{path:'',redirectTo:'home',pathMatch:'full'},
			{
				path:'home',component:HomepageComponent,data:{title:"Home"}
			},
			{
				path:'account',component:UserAccountSettingsComponent,data:{title:"Account Settings"},
        		resolve:{recoveryOptions:UserAccountSettingsResolverService}
      		},
			
			//load restaurant modules
			{
				path:'manage',
				loadChildren:()=>import('../restaurant-modules/restaurant-modules.module').then(m=>m.RestaurantModulesModule)
				// loadChildren:()=>import('./customer/customer.module').then(m=>m.CustomerModule)

			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
	providers:[StaffAuthGuardService]
})
export class RestaurantStaffRoutingModule { }
