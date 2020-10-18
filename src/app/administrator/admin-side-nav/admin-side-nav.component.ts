import { Component, OnInit,EventEmitter,Output } from "@angular/core"
import { AdminOperationsService } from "../services/http/admin-operations.service"

//services
import { ServerDomainService } from "../../services/http/server-domain.service";

@Component({
    selector: "app-admin-sidebar",
    templateUrl: "./admin-side-nav.component.html",
    styleUrls: [
        './admin-side-nav.component.css'
    ]
})


export class AdminSideNavComponent implements OnInit {
    @Output() toggleSideBar:EventEmitter<any>=new EventEmitter;

    resName: string = null;
    resPicture: string = null;

    logoAssestDir = "";

    constructor(private http: AdminOperationsService,private serverDomain: ServerDomainService) {
        this.logoAssestDir = this.serverDomain.getImgAssetsUrlDir();
    }

    sidebarToggle(){
        this.toggleSideBar.emit();
	}

    ngOnInit() {
        this.getRestaurantInfo();
    }

    getRestaurantInfo() {
        this.http.getRestaurantInfo()
            .subscribe((response: any) => {
                let data=response.data.fetched
                this.resName=data.name;
                this.resPicture=data.picture;
                // console.log(response)
            })
    }
}