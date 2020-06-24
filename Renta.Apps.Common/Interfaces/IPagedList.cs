namespace Renta.Apps.Common.Interfaces
{ 
    public interface IPagedList<T>
    {
        T[] Items { get; set; }

        int PageNumber { get; set; }

        int PageSize { get; set; }

        int TotalItemCount { get; set; }

        int PageCount { get; }
    }
}