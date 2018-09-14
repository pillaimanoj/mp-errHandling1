import { Injectable, Injector } from "@angular/core";
import {
  HttpErrorResponse,
  HttpClient,
  HttpHeaders
} from "@angular/common/http";

import { BsModalRef } from "ngx-bootstrap/modal/bs-modal-ref.service";
import { BsModalService } from "ngx-bootstrap";
import { ModalComponent } from "../../components/shared/modal/modal.component";
import {
  AppConstants,
  HttpResponseMessages
} from "../../model/common/AppConstants";
import { environment } from "../../../environments/environment";
import { ValidationError } from "./validation-error";
import { ErrorInformation, ErrorType, LogLevel } from "./error-information";
import { CriticalError } from "./critical-error";
import { ViewModelResult } from "../../model/common/view-model-result";
import { AuthorizationService } from "../authorization.service";
import { AuthenticationService } from "../authentication.service";

@Injectable()
export class ErrorLogService {
  modalService: BsModalService;
  private name: String = "ErrorLogService";
  bsModalRef: BsModalRef;
  webApiUrl: string;
  httpOptions = {
    headers: new HttpHeaders({
      Accept: "application/json"
      // Authorization: "my-auth-token"
    })
  };

  constructor(
    private injector: Injector,
    private http: HttpClient,
    private authenticationService: AuthenticationService
  ) {
    this.webApiUrl = environment.apiUrl;
  }

  logError(error: any) {
    // Returns a date converted to a string using Universal Coordinated Time (UTC).
    const date = new Date().toUTCString();
    
    if (error instanceof HttpErrorResponse) {
    
      // log error
      !environment.production
        ? console.error(
            date,
            this.getMessageFromStatusCode((<HttpErrorResponse>error).status),
            error.message,
            ". Status code:",
            (<HttpErrorResponse>error).status
          )
        : console.error(
            date,
            this.getMessageFromStatusCode((<HttpErrorResponse>error).status)
          );

      if (error.status === 401) {
        
        this.authenticationService.logOut();
        return;
      }

      // show error message
      this.showError(
        this.getMessageFromStatusCode((<HttpErrorResponse>error).status)
      );
    } else if (error instanceof ValidationError) {
      // log error
      !environment.production
        ? console.error(
            date,
            `${AppConstants.validationError} ${error.message}`,
            error.message,
            error.stack
          )
        : console.error(date, AppConstants.validationError);

      // log error to Server - Not needed - Validation Error comes from Server; it will be logged at Server Side

      // show error message
      error.message = error.message.replace(/\r/g, "<br />");
      this.showError(`${AppConstants.validationError} <br /> ${error.message}`);
    } else if (error instanceof TypeError) {
      // log error
      !environment.production
        ? console.error(
            date,
            AppConstants.typeError,
            error.message,
            error.stack
          )
        : console.error(date, AppConstants.typeError);

      // log error to Server
      let errorInfo = new ErrorInformation(
        ErrorType.typeError,
        error.message,
        error.stack,
        "WebApp",
        LogLevel.error,
        ""
      );
      this.logErrorToServer(errorInfo);

      // show error message
      this.showError(AppConstants.typeError);
    } else if (error instanceof ReferenceError) {
      // A client-side or network error occurred. Handle it accordingly.
      !environment.production
        ? console.error(date, AppConstants.referenceError, error.message)
        : console.error(date, AppConstants.referenceError);

      // log error to Server
      let errorInfo = new ErrorInformation(
        ErrorType.referenceError,
        error.message,
        error.stack,
        "WebApp",
        LogLevel.error,
        ""
      );
      this.logErrorToServer(errorInfo);

      // show error message
      this.showError(AppConstants.referenceError);
    } else if (error instanceof CriticalError) {
      // log error
      !environment.production
        ? console.error(
            date,
            AppConstants.generalError,
            error.message,
            error.stack
          )
        : console.error(date, AppConstants.generalError);

      // log error to Server
      let errorInfo = new ErrorInformation(
        ErrorType.criticalError,
        error.message,
        error.stack,
        "WebApp",
        LogLevel.error,
        ""
      );
      this.logErrorToServer(errorInfo);

      // show error message
      this.showError(AppConstants.criticalError);
    } else if (error instanceof Error) {
      this.mapError(error);
    } else {
      // log error
      !environment.production
        ? console.error(
            date,
            AppConstants.somethingHappened,
            error.message,
            error.stack
          )
        : console.error(date, AppConstants.somethingHappened);

      // log error to Server
      let errorInfo = new ErrorInformation(
        ErrorType.generalError,
        error.message,
        error.stack,
        "WebApp",
        LogLevel.error,
        ""
      );
      this.logErrorToServer(errorInfo);

      // show error message
      this.showError(AppConstants.somethingHappened);
    }

    // check environment
    /* if (!environment.production) {
      this.showError(error.message);
    } */
  }

  mapError(error: Error) {
    let errMsg = AppConstants.generalError;
    let isCriticalError = false;
    // Returns a date converted to a string using Universal Coordinated Time (UTC).
    const date = new Date().toUTCString();

    let myError: any;
    myError = error;

    if (error.hasOwnProperty("rejection")) {
      error = myError.rejection as Error;
      if (error.message.indexOf("Cannot match any routes. URL Segment") > -1) {
        error.message = "Page not found! " + error.message;
        errMsg = "Page not found";
        isCriticalError = true;
      }
    }

    // log error
    !environment.production
      ? console.error(
          date,
          AppConstants.generalError,
          error.message,
          error.stack
        )
      : console.error(date, AppConstants.generalError);

    let errorInfo = new ErrorInformation(
      isCriticalError ? ErrorType.criticalError : ErrorType.generalError,
      errMsg,
      error.stack,
      "WebApp",
      LogLevel.error,
      ""
    );
    this.logErrorToServer(errorInfo);

    // show error message
    this.showError(errMsg);
  }

  showError(message) {
    const initialState = {
      list: [message],
      title: "Error"
    };

    if (this.modalService == null) {
      this.modalService = this.injector.get(BsModalService);
    }

    this.bsModalRef = this.modalService.show(ModalComponent, { initialState });

    this.bsModalRef.content.closeBtnName = "Close";
  }

  getMessageFromStatusCode(statusCode) {
    switch (statusCode) {
      case 400: {
        return HttpResponseMessages.httpBadRequest;
      }
      case 401: {
        return HttpResponseMessages.httpUnauthorized;
      }
      case 403: {
        return HttpResponseMessages.httpForbidden;
      }
      case 404: {
        return HttpResponseMessages.httpNotFound;
      }
      case 409: {
        return HttpResponseMessages.httpConflict;
      }
      default: {
        return HttpResponseMessages.httpInternalServerError;
      }
    }
  }

  logErrorToServer(erroInformation: ErrorInformation): any {
    if (environment.production) {
      this.http
        .post<ViewModelResult>(
          `${this.webApiUrl}api/v${environment.apiVersion}/error/log`,
          erroInformation,
          this.httpOptions
        )
        .subscribe(
          response => {
            if (response.IsValid) {
              console.log("Logged Error: " + response.Id);
            }
          },
          error => {
            console.log("Failed to log error");
          }
        );
    }
  }
}
