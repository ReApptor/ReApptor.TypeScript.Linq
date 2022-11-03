import IPagedList from "../interfaces/IPagedList";
import PagedListUtility from "../utilities/PagedListUtility";

export default class PagedList<T = {}> implements IPagedList<T> {
    
    public items: T[] = [];
    
    public totalItemCount: number = 0;

    public pageNumber: number = 0;

    public pageSize: number = 0;

    public get pageCount(): number {
        return ((this.totalItemCount > 0) && (this.pageSize > 0)) ? ((this.totalItemCount - 1) / this.pageSize + 1) : 1;
    }
    
    public isPagedList: true = true;

    public static toPagedList<T>(items: T[], pageNumber: number, pageSize: number): IPagedList<T> {
        return PagedListUtility.toPagedList<T>(items, pageNumber, pageSize);
    }
}