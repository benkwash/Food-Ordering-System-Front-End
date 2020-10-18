import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//ngx bootstrap components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';

//components
import { HomePageComponent } from './home-page/home-page.component';
import { AdministratorWelcomeComponent } from "./welcome/welcome.component";
import { AdminNavbarComponent } from "./admin-navbar/admin-navbar.component";
import { AdminParentContainerComponent } from './admin-parent-container/admin-parent-container.component';
import { BasicConfigurationComponent } from './basic-configuration/basic-configuration.compontent'

//side nav
import { AdminSideNavComponent } from "./admin-side-nav/admin-side-nav.component";

//services
import { ConfigurationResolverService } from './services/other/configuration-resolver.service'

//other modules
import { AdministratorRoutingModule } from './administrator-routing.module';
import { SharedModule } from "../shared/shared.module";
import { SharedMaterialModule } from "../shared/shared-material.module"
import { ClickOutsideModule } from 'ng-click-outside';
//for navbar

@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		SharedMaterialModule,
		AdministratorRoutingModule,
		BsDropdownModule.forRoot(),
		CollapseModule.forRoot(),
		ClickOutsideModule,
	],
	providers: [
		ConfigurationResolverService
	],
	declarations: [
		AdministratorWelcomeComponent,
		HomePageComponent,
		AdminNavbarComponent,
		AdminParentContainerComponent,
		BasicConfigurationComponent,
		AdminSideNavComponent

	]
})
export class AdministratorModule { }
