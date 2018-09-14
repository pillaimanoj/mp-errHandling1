import { Injectable, ErrorHandler } from "@angular/core";
import { ErrorLogService } from "../../services/error-handling/error-log.service";
import { HttpErrorResponse } from "../../../../node_modules/@angular/common/http";
import { AuthenticationService } from "../authentication.service";

// global error handler that utilizes the above created service (ideally in its own file)
@Injectable()
export class GlobalErrorHandler extends ErrorHandler {
  constructor(
    private errorLogService: ErrorLogService,
    private authenticationService: AuthenticationService
  ) {
    super();
  }

  handleError(error) {
    console.log("there is an error" + error);
    this.errorLogService.logError(error);
  }
}
