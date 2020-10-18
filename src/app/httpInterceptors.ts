/* "Barrel" of Http Interceptors */
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import {AuthIntercepterService} from "./services/other/auth-intercepter.service";

/** Http interceptor providers in outside-in order */
export const httpInterceptorProviders = [
  { 
  	//Main App-level Interceptor
  	provide: HTTP_INTERCEPTORS, useClass:AuthIntercepterService, multi: true 
  },
];