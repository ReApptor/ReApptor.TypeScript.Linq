export abstract class StringUtilities {
    public static pascalToCamelCase(str: string) {
        const [first, ...rest] = str;
        return [first.toLowerCase(), ...rest].join('');
    }
}
