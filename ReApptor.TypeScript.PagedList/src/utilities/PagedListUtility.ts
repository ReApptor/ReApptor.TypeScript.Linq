import IPagedList from "../interfaces/IPagedList";

export default class PagedListUtility {

    private static inRange(pageNumber: number, pageSize: number, totalItemCount: number): boolean {
        const lastPageNumber: number = totalItemCount / pageSize + 1;
        return (pageNumber <= lastPageNumber);
    }

    public static toPagedList<T>(items: readonly T[] | null | undefined, pageNumber: number, pageSize: number): IPagedList<T> {

        items = items ?? [];

        if (pageNumber <= 0) {
            pageNumber = 1;
        }

        if (pageSize <= 0) {
            pageSize = Number.MAX_SAFE_INTEGER;
        }

        const firstIndex: number = (pageNumber - 1) * pageSize;
        const totalItemCount: number = items.length;

        if (!this.inRange(pageNumber, pageSize, totalItemCount)) {
            return this.toPagedList(items, 1, pageSize);
        }
        
        let pageCount: number = Math.trunc(totalItemCount / pageSize);

        if (pageCount === 0) {
            pageCount = 1;
        } else if (totalItemCount > pageCount * pageSize) {
            pageCount++;
        }

        const pageItems: T[] = items.slice(firstIndex, firstIndex + pageSize);

        return {
            items: pageItems,
            pageCount: pageCount,
            pageSize: pageSize,
            totalItemCount: totalItemCount,
            pageNumber: pageNumber
        }
    }

}