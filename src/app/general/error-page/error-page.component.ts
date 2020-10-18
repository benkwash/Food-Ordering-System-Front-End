import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {RouterUrlTrackingService} from "../../services/other/router-url-tracking.service";

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent implements OnInit {

  constructor(private router:Router,private trackedRoutes:RouterUrlTrackingService) {
  }

  ngOnInit() {
  }

  //navigate to the previous route(referrer)
  public goToPreviousPage(){
    let previousUrl = this.trackedRoutes.getPreviousUrl();
    this.router.navigateByUrl(previousUrl);
  }
}
