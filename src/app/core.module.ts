import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {Title } from '@angular/platform-browser';

//services
import {AppDataService} from "./services/data/app-data.service";
import {UserAccountSettingsResolverService} from "./services/other/user-account-settings-resolver.service";
import {CustomValidatorsService} from "./services/other/custom-validators.service";
import {FunctionsService} from "./services/other/functions.service";
import {ServerDomainService} from "./services/http/server-domain.service";
import {AppBackendOperationsService} from "./services/http/app-backend-operations.service";
import {AuthenticationService} from "./services/other/authentication.service";
import {PushNotificationService} from "./services/other/push-notifications.service";
import {CustomErrorHandlerService} from "./services/other/custom-error-handler.service";
import {AppErrorLoggerService} from "./services/other/app-error-logger.service";
import {GeneralPhotoUploadService} from "./services/other/general-photo-upload.service";
import {FooterPrintService} from "./services/other/footer-print.service";
import {AppProductInformationService} from "./services/other/app-product-information.service";
import {RouterUrlTrackingService} from "./services/other/router-url-tracking.service";
import {AdminOperationsService} from "./administrator/services/http/admin-operations.service";
import {AccountRecoverProcessService} from "./services/data/account-recover-process.service";
import {UserPasswordInfoService} from "./services/other/user-password-info.service";
import {LiveChatDataService} from './services/data/live-chat-data.service';
import {CanDeactivateGuardService} from "./services/other/can-deactivate-guard.service";
import {GlobalSetTitleService} from "./services/other/global-set-title.service";

import {CustomerUnsignedService} from './customer/services/http/customer-unsigned.service'

//http interceptor services
import {httpInterceptorProviders} from "./httpInterceptors";


//module should contain all relevant services and components or directives
//need by the entire app
//of course some services are not needed app-wide but defining them in the core module
//will make it easier to reset their data states during a logout operation
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
	  Title,
	  // { provide: ErrorHandler, useClass: CustomErrorHandlerService},
	  httpInterceptorProviders, //all interceptors provided there
	  AppBackendOperationsService,
	  AuthenticationService,
	  ServerDomainService,
	  CustomValidatorsService,
	  FunctionsService,
	  PushNotificationService,
	  GeneralPhotoUploadService,
	  FooterPrintService,
	  AppProductInformationService,
	  RouterUrlTrackingService,
	  GlobalSetTitleService,
	  AppErrorLoggerService,
	  AppDataService,
	  AccountRecoverProcessService,
	  AdminOperationsService, //needed by admin-data too
	  UserAccountSettingsResolverService,
	  UserPasswordInfoService,
	  LiveChatDataService,
	  CanDeactivateGuardService,
	  CustomerUnsignedService	  

  ]
})
export class CoreModule { }
