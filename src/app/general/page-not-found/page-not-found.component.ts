import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {RouterUrlTrackingService} from "../../services/other/router-url-tracking.service";

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {
  constructor(private router:Router,private trackedRoutes:RouterUrlTrackingService) {
  }

  ngOnInit() {}

  //navigate to the previous route(referrer)
  public goToPreviousPage(){
    let previousUrl = this.trackedRoutes.getPreviousUrl();
    this.router.navigateByUrl(previousUrl);
  }

}
