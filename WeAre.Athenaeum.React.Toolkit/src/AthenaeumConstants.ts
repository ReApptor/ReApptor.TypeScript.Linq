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

    public static readonly defaultGuid: string = "00000000-0000-0000-0000-000000000000";

    public static readonly apiError = "__API__";
}