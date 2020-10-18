import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//components
import{DeliveryComponent} from './delivery/delivery.component';
import {MenuComponent} from './menu/menu.component';
import {OrderComponent} from './order/order.component';
import {StaffComponent} from './staff/staff.component';
import {RatingsComponent} from './ratings/ratings.component';
import {AccountsComponent} from './accounts/accounts.component';


//services
import {PermissionsAuthGuardService} from './services/other/permissions-auth-guard.service'

//modules


const routes: Routes = [
    //routes
    { 
        path:'',children:[
            {
                path:'staff',component:StaffComponent,
                canActivate : [PermissionsAuthGuardService],
                data:{title:"Manage Staff",yoyoPermission:"staff"},
            },
            {
                path:'menu',component:MenuComponent,
                canActivate : [PermissionsAuthGuardService],
                data:{title:"Manage Restaurant Menu",yoyoPermission:"menu"}
            },
            {
                path:'orders',component:OrderComponent,
                canActivate : [PermissionsAuthGuardService],
                data:{title:"Manage Orders",yoyoPermission:"orders"}
            },
            {
                path:'delivery',component:DeliveryComponent,canActivate : [PermissionsAuthGuardService],
                data:{title:"Deliveries",yoyoPermission:"delivery"}
            },
            {
                path:'rating',component:RatingsComponent,canActivate : [PermissionsAuthGuardService],
                data:{title:"Rating and reviews",yoyoPermission:"rating"}
            },
            {
                path:'accounts',component:AccountsComponent,canActivate : [PermissionsAuthGuardService],
                data:{title:"Restaurant revenue",yoyoPermission:"accounts"}
            }
        ]
    }

    
    
];



@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
	providers:[
        // AdminAuthGuardService
    ]
})
export class RestaurantModulesRoutingModule { }