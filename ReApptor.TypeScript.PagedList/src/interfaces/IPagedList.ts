export default interface IPagedList<T = {}> {
    items: T[];

    pageNumber: number;

    pageSize: number;

    pageCount: number;

    totalItemCount: number;
}