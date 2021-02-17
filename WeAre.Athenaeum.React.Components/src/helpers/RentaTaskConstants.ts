import {AthenaeumConstants, GeoCoordinate} from "@weare/athenaeum-toolkit";

export default class RentaTaskConstants extends AthenaeumConstants {
    
    public static readonly applicationName: string = "RentaTask";

    public static readonly maxHoursPerDay = 24;
    
    public static readonly canModifyHoursRange = 24;

    // 10 MB
    public static readonly maxFileUploadSizeInBytes: number = 10 * 1024 * 1024;

    // 50 MB
    public static readonly maxImageRequestSizeInBytes: number = 50 * 1024 * 1024;

    public static readonly imageFileTypes: string[] = ["image/gif", "image/jpeg", "image/png"];
    
    public static readonly alertCloseDelay = 5000;
    
    public static readonly alertAnimationDelay = 500;
    
    public static readonly defaultLocation: GeoCoordinate = new GeoCoordinate(60.192059, 24.945831);
    
    // "If user has been signed in more than 15 hours straight throw user out"
    public static readonly signOutExpirationTimeOut: number = 15;
    
    // 255
    public static readonly maxTitleDescriptionLength: number = 255;
}