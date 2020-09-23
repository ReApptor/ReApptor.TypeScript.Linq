export enum SortDirection {
    Asc,

    Desc
}

export default class ArrayUtility {
    public static sortByProperty<TItem>(propertyName: string, sortDirection: SortDirection | null = SortDirection.Asc): (a: TItem , b: TItem) => number {
        const direction: number = (sortDirection == SortDirection.Desc) ? -1 : 1;
        
        return (firstItem: TItem | any , secondItem: TItem | any) => {
            const x: any = firstItem[propertyName];
            const y: any = secondItem[propertyName];
            const result: number = (x < y)
                ? -1
                : (x > y)
                    ? 1
                    : 0;
            return result * direction;
        }
    }

    public static sort<TItem>(first: TItem | any , second: TItem | any, sortingType: SortDirection | null = SortDirection.Asc): number {
        const direction: number = (sortingType == SortDirection.Desc) ? -1 : 1;

        const result: number = (first < second)
            ? -1
            : (first > second)
                ? 1
                : 0;

        return result * direction;
    }

    public static chunk<TItem>(givenArray: TItem[], chunkSize: number): TItem[][] {
        const result: TItem[][] = [];

        const givenArrayCopy: TItem[] = [...givenArray];

        while (givenArrayCopy.length) {
            result.push(givenArrayCopy.splice(0, chunkSize));
        }

        return result;
    }
}