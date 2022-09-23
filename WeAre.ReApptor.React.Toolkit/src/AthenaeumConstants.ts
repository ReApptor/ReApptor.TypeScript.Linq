export default class AthenaeumConstants {

    public static readonly badRequestStatusCode: number = 400;

    public static readonly unauthorizedStatusCode: number = 401;

    public static readonly forbiddenStatusCode: number = 403;

    public static readonly notFoundStatusCode: number = 404;

    public static readonly internalServerErrorStatusCode: number = 500;

    public static readonly okStatusCode: number = 200;

    /**
     * 768px (bootstrap: $break-md)
     */
    public static readonly desktopMinWidth: number = 768;

    public static readonly newLineRegex: RegExp = /\r\n|\\r\\n|\n\r|\n|\\n|\r|<br>|<br\/>/g;

    public static readonly markTagRegex: RegExp = /<\s*mark[^>]*>(.*?)<\s*\/\s*mark>/ig;

    public static readonly smallTagRegex: RegExp = /<\s*small[^>]*>(.*?)<\s*\/\s*small>/ig;

    public static readonly boldTagRegex: RegExp = /<\s*b[^>]*>(.*?)<\s*\/\s*b>/ig;
    
    public static readonly italicTagRegex: RegExp = /<\s*i[^>]*>(.*?)<\s*\/\s*i>/ig;
    
    public static readonly dateRegex: RegExp = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(:([0-5][0-9]))?(Z)?$/;

    public static readonly zeroTimeRegex: RegExp = /T00:00:00((.?0+)?)$/;
    
    public static readonly guidRegex: RegExp = /^([0-9A-Fa-f]{8}[-][0-9A-Fa-f]{4}[-][0-9A-Fa-f]{4}[-][0-9A-Fa-f]{4}[-][0-9A-Fa-f]{12})$/;

    public static readonly defaultGuid: string = "00000000-0000-0000-0000-000000000000";

    public static readonly apiError = "__API__";
}