import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GhLocationsService {

  private regions:any=[
		"Ashanti Region",
		"Bono Region",
		"Bono East Region",
		"Ahafo Region",
		"Central Region",
		"Eastern Region",
		"Greater Accra Region",
		"Nothern Region",
		"Savannah Region",
		"North East Region",
		"Upper East Region",
		"Upper West Region",
		"Volta Region",
		"Oti Region",
		"Western Region",
		"Western north Region"
	];
  constructor() { }


  getRegions(){
    return this.regions;
  }

}
