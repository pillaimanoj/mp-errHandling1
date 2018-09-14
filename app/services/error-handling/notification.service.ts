import { Injectable } from "@angular/core";
import { Observable ,  Subject } from "rxjs";
import { Notification } from "../../model/notifications/notification";
import { ErrorLogService } from "../../services/error-handling/error-log.service";
import { CriticalError } from "./critical-error";
import { ErrorInformation } from "./error-information";

@Injectable()
export class NotificationService {

  private notificationObservable: Subject<Notification>;

  constructor(private errorLogService: ErrorLogService) {
    this.notificationObservable = new Subject<Notification>();
  }

  public getNotificationObservable(): Subject<Notification> {
    return this.notificationObservable;
  }

  public showError(error: Notification) {
    this.errorLogService.logError(error);
    this.notificationObservable.next(error);
  }

  public logError(error: any, cb?: () => void) {
    this.errorLogService.logError(error);
  }

  public showInfo(info: Notification) {
    this.notificationObservable.next(info);
  }
}
