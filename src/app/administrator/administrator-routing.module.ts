import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//components
import {AdminParentContainerComponent} from "./admin-parent-container/admin-parent-container.component";
import {HomePageComponent} from "./home-page/home-page.component";
import {AdministratorWelcomeComponent} from "./welcome/welcome.component";

//services
import {AdminAuthGuardService} from "./services/other/admin-auth-guard.service";
import {UserAccountSettingsResolverService} from "../services/other/user-account-settings-resolver.service";
import {CanDeactivateGuardService} from "../services/other/can-deactivate-guard.service";
import {ConfigurationResolverService}  from './services/other/configuration-resolver.service'

//components
import {BasicConfigurationComponent} from "./basic-configuration/basic-configuration.compontent"

//modules
import {UserAccountSettingsComponent} from "../user-account-settings/user-account-settings.component";
import {ContactComponent} from "../contact/contact.component";
import { resolve } from 'url';

const routes: Routes = [
	{path:'',component:AdminParentContainerComponent,canActivate:[AdminAuthGuardService],
		children:
		[
			{path:'',redirectTo:'home',pathMatch:'full'},
			{
				path:'home',component:HomePageComponent,data:{title:"Home | Dashboard"}
			},
			{
				path:'account',component:UserAccountSettingsComponent,data:{title:"Account Settings"},
        		resolve:{recoveryOptions:UserAccountSettingsResolverService}
      		},
			
			{path:'contact',component:ContactComponent,data:{title:"Contact Us"}},
			{path:'welcome',component:AdministratorWelcomeComponent,data:{title:"You're welcome!"}},
			//load module lazily
			{
				path:'configuration', component:BasicConfigurationComponent,data:{title:"Restaurant Configuration"},
				resolve:{configOptions:ConfigurationResolverService}
			},
			//load restaurant modules
			{
				path:'manage',
				loadChildren:()=>import('../restaurant-modules/restaurant-modules.module').then(m=>m.RestaurantModulesModule)
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
	providers:[AdminAuthGuardService]
})
export class AdministratorRoutingModule { }
