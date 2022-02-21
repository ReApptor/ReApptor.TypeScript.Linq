export abstract class PathUtilities {
    public static componentAbsolutePathToComponentName(dir: string) {
        const coNameSplit = dir.split("/");
        return coNameSplit[coNameSplit.length - 1];
    }
}
