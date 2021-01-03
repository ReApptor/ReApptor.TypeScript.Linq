class AthenaeumConstants {

    public readonly badRequestStatusCode: number = 400;

    public readonly unauthorizedStatusCode: number = 401;

    public readonly forbiddenStatusCode: number = 403;

    public readonly notFoundStatusCode: number = 404;

    public readonly internalServerErrorStatusCode: number = 500;

    public readonly okStatusCode: number = 200;

    /**
     * 768px (bootstrap: $break-md)
     */
    public readonly desktopMinWidth: number = 768;

    public readonly newLineRegex: RegExp = /\r\n|\\r\\n|\n\r|\n|\\n|\r|<br>|<br\/>/g;

    public readonly markTagRegex: RegExp = /<\s*mark[^>]*>(.*?)<\s*\/\s*mark>/ig;

    public readonly smallTagRegex: RegExp = /<\s*small[^>]*>(.*?)<\s*\/\s*small>/ig;

    public readonly defaultGuid: string = "00000000-0000-0000-0000-000000000000";

    public readonly apiError = "__API__";
}

export default new AthenaeumConstants();