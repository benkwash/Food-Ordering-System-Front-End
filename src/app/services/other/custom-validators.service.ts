import { Injectable } from '@angular/core';
@Injectable()

export class CustomValidatorsService {
  //declare validations
    validationMsg: { [type: string]: string } = {
		 email:"A valid email is required", //email requirement
		 password:"A valid password is required",
		 strong_password:"A minimum of eight characters and at least one uppercase letter, " +
		 "one lowercase letter and one number is required" ,  //password requirement
		 confirmPassword:"Password does not match", //confirm password for signUp
		 passwordMismatch:"Password does not match", //confirm password for signUp
		 passwordNotMatch:"The password does not match your current password",
		 passwordIncorrect:"The password is incorrect",
		 emailExists:"Email is used by another user",
		 passwordExists:"password has already been used.", //change password (for signUp)
		 username:"A valid username/email is required", //signUp
		 password_not_username:"Password cannot be not be the same as the username", //signUp
		 usernameExists:"Username is currently in being used by another user",
		 noCurriculum:"Please select a curriculum ", //school configuration
		 noDepartment:'Please select at least one department ', //school configuration (dept config)
		 name:"Provide a valid name. Special characters are not allowed",
		 word: "Please provide a valid word or words",
		 words: "Please provide a valid word or words",
		 date:"Please select a valid date",
		 select:"Please select at least a valid option",
		 text:"Please provide a valid text. Special characters are not allowed",
		 info:"Please provide a valid information",
		 code:"Please provide a valid code",
		 incorrect_code:"Incorrect code. A correct code is required",
		 phone:"A valid phone number is required",
		 number:"A valid phone number is required",
		 basic_number:"A valid number is required",
		 server_billAmt: "A valid bill amount is required",
		 server_billDescription:"A valid bill description is required",
		 server_multi_studentInfo:"A valid student list is required",
		 server_billYear:"You can only issue students bills for either the current or next term.",
		 server_paymentAmt:"A valid payment amount is required",
		 server_paymentDescription:"A valid payment description is required",
		 server_single_studentInfo:"A valid student information is required",
		 server_payYear:"You can only issue payments for the current."
  	};

  constructor() {
  }

  //  define all patterns needed for validation
  emailRegex(min=0,max=100){
    return "^[A-Za-z0-9\\._%+-]+@[A-Za-z0-9\\.-]+\\.[A-Za-z]{2,"+max+"}$";
  }

	// [<>!~`%^\*{}\[\]]
	nameRegex(min=0,max=100) {
		//the forbidden special characters are not allowed
		//Only letters,numbers,spaces and hyphen is allowed with other chars are allowed
		//use \\ to persist with \ else it'll be ignored but may be crucial during validation
		//[\.\s] :=>[.s] , but [\\.\\s] :=> [\.\s]
		return "^[A-Za-z0-9-,_:&$#@+!*%'\\/\\(\\)\\.\\s]{"+min+","+max+"}$";
	}

	customNameRegex(min=0,max=100){
		return this.nameRegex(min,max);
	}

	usernameRegex(min=1,max=50){
		return this.nameRegex(min,max);
	}

	wordsRegex(min=0,max=100){
		return this.nameRegex(min,max);
	}

	textRegex(min=0,max=1000){
		//use \\ to persist with \ else it'll be ignored but may be crucial during validation
		//[\.\s] :=>[.s] , but [\\.\\s] :=> [\.\s]
		return "^[A-Za-z0-9-,_:&$#@+!%*'\\/\\(\\)\\?\\s\\n\\t\\r\\.]{"+min+","+max+"}$";
	}

	//normal password just like any ordinary word
	passwordRegex(min=1,max=50){
		return this.nameRegex(min,max);
	}

	//simple number validation rules
	numberRegex(min=10,max=20){
		// numbers,hypen or ().
		// eg:(054)-6837194 or (054)-683-7194 or 054-6837194 or 0546837194, etc
		return "^[0-9-\\(\\)\\+\\s]{"+min+","+max+"}$";
	}

	getValidationMsg(type:string):string {
    return this.validationMsg[type];
  }

	//check whether variable is a string
	isString(value) {
		return (typeof value == "string") ? true:false;
	}
	public passBasicValidation(val,min=0,max=50){
		//input should be a string
		//string should be within the character range
		//string should not include some provided special characters

		//special forbidden characters: <>!~`%^\*{}\[\]
		return (this.isString(val) && val.length >= min && val.length <= max &&
				  !val.match(/[<>~`^\{\}\[\]]/)) ? true:false;
	}

	public word(word,min=0,max=50){
		//word should not contain a space, new line, tab, carriage return
		return (this.passBasicValidation(word,min,max) && !word.match(/[\s\n\r\t]/)) ? true:false;
	}

	public words(val,min=0,max=100){
		//pass basic validation and accept a space(s) with more characters than the default
		//words should not contain new line, tab or carriage return
		return (this.passBasicValidation(val,min,max) && !val.match(/[\n\r\t]/))
	}

	//validate telephone number
	telephone(value){
		//validates a telephone number
		// numbers,hypen or ().
		// eg:(054)-6837194 or (054)-683-7194 or 054-6837194 or 0546837194, etc

		//return a simple number validation for now
		return (this.isString(value) && value.match(/^[0-9-\(\)\+\s]{10,}$/)) ? true:false;
	}

	//name validation
	validateName(name,min=1,max=50):boolean{
		//check words validation
		return this.words(name,min,max);
	}

	//username validation
	username(userName){
		//normal word validation
		return this.word(userName);
	}

  password(password){
	  //normal word validation
	  return this.word(password,1);
  }

	passwordStrongEnough(password) {
		if(this.isString(password)){
			//it doesn't have to be from the beginning. match anywhere
			//at least a number,uppercase,lowercase & 8min characters are needed(whatever the rest are)
			return !!(password.match(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d){8,}/));
		}else {
			return false;
		}
	}

  email(email){
    //html provides that functionality for us
    return !!(email.match(/^[A-Za-z0-9\._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,100}$/));
  }

	validateImageFile(file:File):boolean
	{
		//only upload if file is an image
		//file size shouldn't exceed ? 11mb:=> 11,000,000 bytes
		if(file.name && file.size){
			return (file.name.match(/\.(png|jpg|jpeg|JPG|PNG|JPEG)$/) && file.size <= 11000000);
		}else {
			return false;
		}
	}

	acceptedImageFileTypes():string {
		return ".png, .jpeg, .jpg, .JPG .PNG .JPEG";
	}

	//date regex
	dateRegex():string {
		//yyyy-mm-dd|yyyy-m-d or any combinations
		return "[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}";
	}

	//manually validate date, when browser has no support for dates
	validateDate(date):boolean
	{
		//manually convert date to ISO string if not string
		let localDate = "";

		try{
			//try to convert date to ISOString
			localDate = new Date(date).toISOString();
		}catch(err){
			localDate = null;
		}

		//jan,feb,mar,apr,may,jun,jul,aug,sep,oct,nov,dec
		let days = [31,28,31,30,31,30,31,31,30,31,30,31];

		//we assume the input is of the format yyyy-mm-dd
		if(localDate.match(this.dateRegex()))
		{
			let valid = true;

			//split into yyyy-mm-dd
			let split = localDate.split('-');
			let year = parseInt(split[0],10); //base 10:decimal
			let month = parseInt(split[1],10); //base 10:decimal
			let day = parseInt(split[2],10); //base 10:decimal

			//change the no of days in feb to 29 if in a leap year
			let leap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
			days[1] = leap ? 29 : 28; //change feb to either 29 or 28 days

			//validate month
			if(!(month >= 1 && month <= 12)){
				valid = false;
			}

			//validate days
			//provided day should be between the 1 and the maximum day of the specified month
			let maxDays = days[month-1];
			if(!(valid && day >= 1 && day <= maxDays)) {
				valid = false;
			}

			return valid;
		}else {
			return false;
		}
	}
}
