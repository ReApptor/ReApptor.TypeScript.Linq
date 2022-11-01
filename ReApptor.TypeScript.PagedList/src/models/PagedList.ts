import IPagedList from "../interfaces/IPagedList";
import PagedListUtility from "../utilities/PagedListUtility";

export default class PagedList<T = {}> implements IPagedList<T> {

    public totalItemCount: number = 0;

    public pageNumber: number = 0;

    public pageSize: number = 0;

    public get pageCount(): number {
        return ((this.totalItemCount > 0) && (this.pageSize > 0)) ? ((this.totalItemCount - 1) / this.pageSize + 1) : 1;
    }

    public items: T[] = [];

    public static toPagedList<T>(items: T[], pageNumber: number, pageSize: number): PagedList<T> {
        return PagedListUtility.toPagedList(items, pageNumber, pageSize);
    }
}