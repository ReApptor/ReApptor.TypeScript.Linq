import IPagedList from "../interfaces/IPagedList";
import PagedListUtility from "../utilities/PagedListUtility";

declare global {
    interface Array<T> {

        toPagedList(pageNumber: number, pageSize: number): IPagedList<T>;
        
    }
}

export const ArrayExtensions = function () {

    if (Array.prototype.toPagedList == null) {
        Array.prototype.toPagedList = function <T>(pageNumber: number, pageSize: number): IPagedList<T> {
            return PagedListUtility.toPagedList(this, pageNumber, pageSize);
        };
    }

}

ArrayExtensions();