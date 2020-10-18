import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//ngx bootstrap components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';

//components come here
import { DeliveryComponent, DeliveryDialogComponent } from './delivery/delivery.component';
import { MenuComponent, AddMenuDialogComponent } from './menu/menu.component';
import { OrderComponent, OrderDialogComponent, OrderDetailDialogComponent } from './order/order.component';
import { StaffComponent, NewStaffDialogComponent, StaffDialogComponent } from './staff/staff.component';
import {RatingsComponent} from './ratings/ratings.component';
import {AccountsComponent} from './accounts/accounts.component';

//services come here
import { PermissionsAuthGuardService } from './services/other/permissions-auth-guard.service';
import { StaffOperationsService } from './services/http/staff-operations.service';
import { MenuOperationsService } from './services/http/menu-operations.service';
import { DeliveryOperationsService } from './services/http/delivery-operations.service';
import { OrderOperationsService } from './services/http/order-operations.service';
import {RatingOperationsService} from './services/http/rating-operations.service';
import {AccountsOperationsService} from './services/http/accounts-operations.service';


//other submodules here
import { ClickOutsideModule } from 'ng-click-outside';
import { RestaurantModulesRoutingModule } from './restaurant-modules-routing.module';
import { SharedModule } from "../shared/shared.module";
import { SharedMaterialModule } from '../shared/shared-material.module';

@NgModule({
  imports: [
    //modules
    CommonModule,
    SharedModule,
    SharedMaterialModule,
    RestaurantModulesRoutingModule,
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    ClickOutsideModule,
  ],
  providers: [
    //services
    PermissionsAuthGuardService,
    StaffOperationsService,
    MenuOperationsService,
    DeliveryOperationsService,
    OrderOperationsService,
    RatingOperationsService,
    AccountsOperationsService

  ],
  entryComponents: [
    AddMenuDialogComponent
  ],
  declarations: [
    //components
    DeliveryComponent,
    DeliveryDialogComponent,

    MenuComponent,
    AddMenuDialogComponent,

    OrderComponent,
    OrderDialogComponent,
    OrderDetailDialogComponent,

    StaffComponent,
    NewStaffDialogComponent,
    StaffDialogComponent,

    RatingsComponent,

    AccountsComponent
  ]
})
export class RestaurantModulesModule { }



