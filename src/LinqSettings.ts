
export default class LinqSettings {

    /**
     * Supported formats:
     *   "yyyy-MM-ddThh:mm:ss.sssZ"
     *   "yyyy-MM-ddThh:mm:ss+hh:mm"
     * Examples:
     *   "2019-09-25T16:00:20.817Z"
     *   "2019-09-25T16:00:20.817"
     *   "2019-09-25"
     *   "2019-09-24T00:00:00"
     *   "2019-09-24T00:00:00Z"
     *   "2019-10-14T21:00:00.000Z"
     *   "2019-10-16T00:00:00+03:00"
     */
    public stringToDateCastRegex: RegExp = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(:([0-5][0-9]))?(Z)?$/;

    public stringToDateCastResolver: ((date: any) => boolean) = (date) => {
        return (
            (date != null) &&
            (
                ((typeof date === "object") && (date.constructor === Date)) ||
                ((typeof date === "string") && (!!date.match(this.stringToDateCastRegex)))
            )
        );
    }

    public stringToDateCastEnabled: boolean = true;
}