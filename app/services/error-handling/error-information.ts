export class ErrorType {
  public static get typeError(): string {
    return "TypeError";
  }
  public static get criticalError(): string {
    return "CriticalError";
  }
  public static get httpError(): string {
    return "HttpError";
  }
  public static get generalError(): string {
    return "GeneralError";
  }
  public static get referenceError(): string {
    return "ReferenceError";
  }
}

export class LogLevel {
  public static get error(): string {
    return "ERROR";
  }
  public static get audit(): string {
    return "AUDIT";
  }
}

export class ErrorInformation {
  Code: string;
  Message: string;
  Details: string;
  DeviceInfo: string;
  ApplicationName: string;
  LocationURL: string;
  Audience: string;
  Action: string;
  Environment: string;
  Level: string;
  

  constructor(code: string, message: string, details: string, action: string, level: string, audience: string ) {
   
    this.Code = code;
    this.Message = message;
    this.Details = details;
    this.Audience = audience ? audience : "ALL";
    this.Action = action; 
    this.Level = level;
    
    this.ApplicationName = "GSP-" + window.location.host; // Append Client Id if needed
    this.LocationURL = window.location.href;

    this.DeviceInfo = this.readDeviceInfo();
    this.Environment = this.getEnvironment();

  }

  getEnvironment() {
    let url = window.location.host;
    if ( url.indexOf("localhost") > -1 ) {
      return "LOCAL";
    }
    if ( url.indexOf("qa-") > -1 ) {
      return "QA";
    }
    if ( url.indexOf("dev-") > -1 ) {
      return "DEV";
    }
    return "PROD";
  }

  readDeviceInfo(): string {
    let nVer = navigator.appVersion;
    let nAgt = navigator.userAgent;
    let browserName = navigator.appName;
    let fullVersion = "" + parseFloat(navigator.appVersion);
    let majorVersion = parseInt(navigator.appVersion, 10);
    let nameOffset, verOffset, ix;

    // In Opera, the true version is after "Opera" or after "Version"
    if ((verOffset = nAgt.indexOf("Opera")) !== -1) {
      browserName = "Opera";
      fullVersion = nAgt.substring(verOffset + 6);
      if ((verOffset = nAgt.indexOf("Version")) !== -1) {
        fullVersion = nAgt.substring(verOffset + 8);
      }
    } else if (
      (verOffset = nAgt.indexOf("MSIE")) !== -1 ||
      (verOffset = nAgt.indexOf("Trident")) !== -1
    ) {
      // In MSIE, the true version is after "MSIE" in userAgent
      browserName = "Microsoft Internet Explorer";
      fullVersion = nAgt.substring(verOffset + 5);
    } else if ((verOffset = nAgt.indexOf("Chrome")) !== -1) {
      // In Chrome, the true version is after "Chrome"
      browserName = "Chrome";
      fullVersion = nAgt.substring(verOffset + 7);
    }  else if ((verOffset = nAgt.indexOf("Safari")) !== -1) {
        
        // In Safari, the true version is after "Safari" or after "Version"
    
      browserName = "Safari";
      fullVersion = nAgt.substring(verOffset + 7);
      if ((verOffset = nAgt.indexOf("Version")) !== -1) {
        fullVersion = nAgt.substring(verOffset + 8);
      }
    } else if ((verOffset = nAgt.indexOf("Firefox")) !== -1) { 
      browserName = "Firefox";
      fullVersion = nAgt.substring(verOffset + 8);
    } else if (
      (nameOffset = nAgt.lastIndexOf(" ") + 1) <
      (verOffset = nAgt.lastIndexOf("/"))
    ) {
      browserName = nAgt.substring(nameOffset, verOffset);
      fullVersion = nAgt.substring(verOffset + 1);
      if (browserName && browserName.toLowerCase() === browserName.toUpperCase()) {
        browserName = navigator.appName;
      }
    }
    // trim the fullVersion string at semicolon/space if present
    if ((ix = fullVersion.indexOf(";")) !== -1) {
      fullVersion = fullVersion.substring(0, ix);
    }
    if ((ix = fullVersion.indexOf(" ")) !== -1) {
      fullVersion = fullVersion.substring(0, ix);
    }

    majorVersion = parseInt("" + fullVersion, 10);
    if (isNaN(majorVersion)) {
      fullVersion = "" + parseFloat(navigator.appVersion);
      majorVersion = parseInt(navigator.appVersion, 10);
    }

    return "Browser name: " +
        browserName +
        "<br />" +
        "Full version: " +
        fullVersion +
        "<br />" +
        "Major version: " +
        majorVersion +
        "<br />" +
        "navigator.appName: " +
        navigator.appName +
        "<br />" +
        "navigator.userAgent: " +
        navigator.userAgent +
        "<br />" +
        "navigator.userAgent: " +
        navigator.platform +
        "<br />"
  }
}
