import { Injectable } from '@angular/core';
import * as _ from 'lodash';
//noinspection TypeScriptCheckImport
// import isEqual from 'lodash/isEqual';
// import findIndex from 'lodash/findIndex';
// import indexOf from 'lodash/indexOf';


@Injectable()

//useful methods to be used within the app
export class FunctionsService {
	constructor() { }

	//is value a number
	public isANumber(val):boolean {
		return (typeof val === "number") ? true:false;
	}

	public isString(value) {
		return (typeof value == "string") ? true:false;
	}

	//check whether an item is an array or not
	public isArray(val):boolean {
		return (val && Array.isArray(val)) ? true:false;
	}

	//sum up two values(values may be null) that's why a simple method is used here
	//null values are not added
	public sumUpTwoValues(val1,val2)
	{
		if(this.isANumber(val1)  && !this.isANumber(val2)) {
			return val1;
		}else if(!this.isANumber(val1)  && this.isANumber(val2)){
			return val2;
		}else if(this.isANumber(val1)  && this.isANumber(val2)){
			return val1 + val2;
		}else {
			return null;
		}
	}

  	//compares two elements(arrays,objects,variables) using lodash
	//@params:{a,b}
	//@return {bool}
	isEqual(a,b){
    	//noinspection TypeScriptUnresolvedFunction
    	return _.isEqual(a,b);
  	}

	//make a string title case
	toTitleCase(str) {
		return str.replace(/\w\S*/g,function(txt) {
				return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		});
	}

   //recalling lodash function
   //works mostly with objects
	//@param:=> object:[{some stuff},...], search:{something:value, ...}
	//@return {index | -1}
   findIndex(dataObject,searchField){
     	//noinspection TypeScriptUnresolvedFunction
		return _.findIndex(dataObject,searchField);
   }

   //recalling lodash function
   //works mostly for arrays
	//@param:=> array:[data,...], search:string
	//@return {index | -1}
   indexOf(array,search){
     //noinspection TypeScriptUnresolvedFunction
     return array.indexOf(search);
   }

	//to flat single level array
	//ge: var arr1 = [1, 2, [3, 4]];
	//becomes [1, 2, 3, 4]
	//@params:{multi dimensional array array}
	//@return {flattened array}
	flatten(array){
		return array.reduce((acc, val) => acc.concat(val), []);
	}

	// deep level flatten use recursion with reduce and concat
	//recusively
	//eg: var arr1 = [1,2,3,[1,2,3,4, [2,3,4]]];
	//becomes [1, 2, 3, 1, 2, 3, 4, 2, 3, 4]
	//@params:{multi dimensional array array}
	//@return {flattened array}
	flattenDeep(array){
		return array.reduce((acc, val) => Array.isArray(val) ? acc.concat(this.flattenDeep(val)) : acc.concat(val), []);
	}

	//sum values in an array
	sumArrayValues(array){
		let initialValue = 0;
		return  array.reduce((accumulator, currentValue) => accumulator + currentValue,initialValue);
	}

	/**
	 * Get difference between two dates in minutes
	 * @param {String} dateString1
	 * @param {String} dateString2
	 * @returns {boolean}
	 */
	public getDiffDateMinutes(dateString1,dateString2)
	{
		const date1 = new Date(dateString1);
		const date2 = new Date(dateString2);

		//difference between date should be positive
		//time difference in milliseconds
		const diffTime = Math.abs(date2.getTime() - date1.getTime());

		//milliseconds per minute
		const MS_PER_MINUTE = 1000 * 60; //(1S = 1000MS) * 60S = 1MIN

		//discard any decimal(round down)
		//so 4.5min = 4min, 4.9min=4min, 5.1min = 5min
		return Math.floor((diffTime) / MS_PER_MINUTE);
	}

	/**
	 * Get the next academic year from the given current academic year & term
	 * @param {String} acaYear
	 * @param {Number} term
	 * @returns {Array(acaYear,acaTerm)}
	 */
	public getNextAcademicInfo(acaYear,term)
	{
		//get next academic calendar
		//acaYear should be a string and term a number
		if(typeof acaYear == "string" &&  typeof term == "number")
		{
			let nextAcaYear = null;
			let nextAcaTerm = null;

			//only move to the next academic year if in third term
			//else only  increase the term
			if(term == 3) {
				nextAcaYear = this.getNextAcademicYear(acaYear);
				nextAcaTerm = 1;
			}else if(term == 1 || term == 2){
				nextAcaYear = acaYear;
				nextAcaTerm = term + 1;
			}else {
				//unknown term but still return the current one
				nextAcaYear = acaYear;
				nextAcaTerm = term;
			}

			//trailing-1/leading - 1
			return [nextAcaYear,nextAcaTerm];
		}else {
			return [acaYear,term];
		}
	}

	/**
	 * Get the next academic year
	 * @param {String} acaYear
	 * @returns {String}
	 */
	public getNextAcademicYear(acaYear)
	{
		//get next academic year
		//should be a string
		if(typeof acaYear == "string")
		{
			//split acayear ("trailing/leading"=>["trailing","leading"])
			let splitted = acaYear.split("/");

			//trailing+1/leading + 1
			return (parseInt(splitted[0],10) + 1) + "/" + (parseInt(splitted[1],10) + 1);
		}else {
			return acaYear;
		}
	}

	/**
	 * Compare two academic information(academic years and term)
	 * Returns -1,0,1 :(i.e -1 if acaInfo 1 is less than acaInfo 2, 0 if they are equal
	 * and 1 if acaInfo 1 is greater than acaInfo 2)
	 * @param {String} acaYear1
	 * @param {Number} acaTerm1
	 * @param {String} acaYear2
	 * @param {Number} acaTerm2
	 * @return {Number} => -1,0,1
	 */
	public compareAcademicInfo(acaYear1:string,acaTerm1:number,acaYear2:string,acaTerm2:number):number
	{
		let difference = null;

		//acaYear will of format "year/year" .eg: 2018/2019
		if(this.isString(acaYear1) && this.isString(acaYear2))
		{
			try
			{
				//split acaYear ("trailing/leading"=>["trailing","leading"]) and convert to numbers
				const splitted1 = acaYear1.split("/").map(obj=>parseInt(obj));
				const splitted2 = acaYear2.split("/").map(obj=>parseInt(obj));
				const trailing1 = splitted1[0], trailing2= splitted2[0];
				const leading1 = splitted1[1], leading2= splitted2[1];

				//LOGIC
				if(acaYear1 === acaYear2)
				{
					if(acaTerm1 === acaTerm2)
						difference = 0;
					if(acaTerm1 < acaTerm2)
						difference = -1;
					if(acaTerm1 > acaTerm2)
						difference = 1;
				}
				else
				{
					//2018/2019 is greater than 2017/2018(leading and trailing years are greater)
					//2017/2018 is less than 2018/2019(leading and trailing years are lesser
					if(trailing1 < trailing2 || leading1 < leading2)
						difference = -1;
					else if(trailing1 > trailing2 || leading1 > leading2)
						difference = 1;
				}
			}	catch(err){
				difference = null;
			}
		}

		return difference;
	}

	/**
	 * Append string to number(suffix) eg: st,nd,rd or th
	 * @param {Number} number
	 * @return {String}
	 */
	public appendStringToNumberSuffix(number)
	{
		if(this.isANumber(number))
		{
			//rules:
			// st is used with numbers ending in 1 (e.g. 1st, pronounced first)
			//nd is used with numbers ending in 2 (e.g. 92nd, pronounced ninety-second)
			//rd is used with numbers ending in 3 (e.g. 33rd, pronounced thirty-third)
			//As an exception to the above rules,
			// all the "teen" numbers ending with 11, 12 or 13 use -th (e.g. 11th,12th,111th,113th)
			//th is used for all other numbers (e.g. 9th, pronounced ninth).
			//last and last two numbers. eg: for 120=>0 & 20 , 111=>1 & 11, 1113 => 3 & 13th
			let last = number % 10, lastTwo = number % 100;
			if (last == 1 && lastTwo != 11) {
				return number + "st";
			}
			else if (last == 2 && lastTwo != 12) {
				return number + "nd";
			}
			else if (last == 3 && lastTwo != 13) {
				return number + "rd";
			}
			else{
				return number + "th";
			}
		}else {
			return number;
		}
	}

	/**
	 * Get the Month name with the given number
	 * @param {Number} monthNumber
	 * @return {String}
	 */
	public getMonthName(monthNumber)
	{
		let monthList = ["January","February","March","April","May","June",
			"July","August","September","October","November","December"
		];

		//return month string
		return (this.isANumber(monthNumber) && (monthNumber >= 1 && monthNumber <= 12))
			? monthList[monthNumber-1] :"";
	}

	/**
	 * Subtract days from a date
	 * @param date
	 * @param numberOfDays
	 * @returns {Date}
	 */
	public subtractDaysFromDate(date:Date,numberOfDays:number)
	{
		//ALGORITHM:
		//CONVERT DATE TO TIME(unix timestamp in ms)
		//subtract noOfDays * ms in a day from the converted timestamp
		//return a new date
		const ONE_DAY_MS = 1000 * 60 * 60 * 24;

		//may not be a proper date so parse and convert to date
		let parsedDate = new Date(date.toString());

		//get timestamp
		let timestamp = parsedDate.getTime();

		//subtract days from date
		let subtractedDate = timestamp - (numberOfDays * ONE_DAY_MS);

		//return a new date
		return new Date(subtractedDate);
	}

	/**
	 * Get date from date instance
	 * Returned date is of the format : yyyy-mm-dd
	 * @params {Date|String} originalDate
	 * @return {String}
	 */
	public getFullDateInfo(date){
		//convert date : yyyy-mm-dd
		//iso date: yyyy-mm-ddTHH:MM:SS. splitting and retrieving the first item = the actual date
		let dateStr = new Date(date).toISOString();
		
		return dateStr.split("T")[0];
	}

}
