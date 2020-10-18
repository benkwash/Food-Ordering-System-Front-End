import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import { AdminOperationsService } from "../services/http/admin-operations.service";
import { CustomValidatorsService } from "../../services/other/custom-validators.service";
import { GeneralPhotoUploadService } from "../../services/other/general-photo-upload.service";
import { PushNotificationService } from "../../services/other/push-notifications.service";

//highcharts
import * as Highcharts from "highcharts";

@Component({
	selector: 'app-home-page',
	templateUrl: './home-page.component.html',
	styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

	Highcharts = Highcharts;
	public chartOptions: {};
	public pieChart:{};
	progress;
	uploading = false;
	logoLink = "";
	acceptedImageTypes = "";


	//rating
	resRating = {
		rating: 0,
		outOf: 0,
		breakdown: {
			five: 0,
			four: 0,
			three: 0,
			two: 0,
			one: 0
		}
	}

	constructor(private route: ActivatedRoute, private validator: CustomValidatorsService,
		private adminOp: AdminOperationsService, private photoUpload: GeneralPhotoUploadService,
		private notification: PushNotificationService) {
		this.acceptedImageTypes = validator.acceptedImageFileTypes();
	}

	//on adding a file(image), start uploading file immediately
	public onPhotoAdded(event): void {
		//get photo
		let file = (event.target.files.length > 0) ? event.target.files[0] : false;

		//validate image
		//get selected file (a file should be at selected to proceed
		if (file && this.validator.validateImageFile(file)) {
			// set the component state to "uploading"
			this.uploading = true;

			// start the upload and save the progress map
			this.photoUpload.uploadPhoto(file)
				.subscribe((progresRes) => {
					console.log(progresRes)
					//upload progress -1 means completed otherwise, in progress
					//progresRes is an object {progress:number,response:obj
					if (progresRes.progress != -1) {
						//upload in progress
						this.progress = progresRes.progress;
					}
					else {
						//a progress of -1 is sent just before an upload is successful
						let response: any = progresRes.response.body;

						if (response.status == 200 && response.response == "okay") {
							//everything went fine
							this.logoLink = response.data.other.newPhoto;

							//update school logo path
							// this.updateSchoolLogoPath();
						} else if (response.status == 200 && response.response == "form") {
							this.notification.notifyError(response.msg);
						}
					}//end of upload completion
				}, (err) => {
					//reset upload status & progress
					this.uploading = false;
					this.progress = 0;
				}, () => {
					//reset upload status and progress;
					this.uploading = false;
					this.progress = 0;
				});
		}//end of file validation pass
	}//end of method

	ngOnInit() {


		this.getStats();
		this.getRating();
	}

	getRating(){
		this.adminOp.getRestaurantRating()
		.subscribe((response:any)=>{
			if(response.response=="okay"){
				this.resRating=response.data.fetched;
			}
		})
	}
	getStats() {

		this.adminOp.getStats()
			.subscribe((response: any) => {
				this.assChartOptions(response.data.fetched)
				this.assignPieChart(response.data.fetched)
			})
	}

	//assign data to highchart configuration options
	assChartOptions(seriesArray) {
		this.chartOptions = {
			chart: {
				type: 'spline'
			},
			title: {
				text: 'Restaurant Orders'
			},
			subtitle: {
				text: 'for this year'
			},
			yAxis: {
				title: {
					text: 'Number of orders'
				}
			},
			xAxis: {
				categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
					'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
				scrollbar: {
					enabled: false
				},
			},
			legend: {
				layout: 'horizontal',
				align: 'center',
				verticalAlign: 'bottom'
			},
			series: seriesArray,

			// responsive: {
			// 	rules: [{
			// 		condition: {
			// 			maxWidth: 500
			// 		},
			// 		chartOptions: {
			// 			legend: {
			// 				layout: 'horizontal',
			// 				align: 'center',
			// 				verticalAlign: 'bottom'
			// 			}
			// 		}
			// 	}]
			// }

		}
	}

	assignPieChart(data: any) {

		let delivery = {
			name: "Deliveries",
			y: data[0].data.reduce(function (a, b) { return a + b; }, 0),//sum up values
			//options..should be selected and sliced on page load
			sliced: true,
			selected: true
		};
		let pickup = {
			name: "Order pick ups",
			y: data[1].data.reduce(function (a, b) { return a + b; }, 0)
		}
		let table = {
			name: "Seat Reservations",
			y: data[2].data.reduce(function (a, b) { return a + b; }, 0)
		}

		this.pieChart = {
			chart: {
				plotBackgroundColor: null,
				plotBorderWidth: null,
				plotShadow: false,
				type: 'pie'
			},
			title: {
				text: 'Orders percentage breakdown'
			},
			tooltip: {
				pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
			},
			accessibility: {
				point: {
					valueSuffix: '%'
				}
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: {
						enabled: false
					},
					showInLegend: true
				}
			},
			series: [{
				name: 'Orders',
				colorByPoint: true,
				data: [delivery, pickup, table]
			}]
		}
	}
}
