using System.Collections.Generic;
using System.Linq;
using Renta.Apps.Common.Interfaces;

namespace Renta.Apps.Common.Models
{
    public class PagedList<T> : IPagedList<T>
    {
        private T[] _items;
        
        public PagedList()
        {
        }

        public PagedList(int pageNumber, int pageSize)
        {
            _items = new T[0];
            PageNumber = pageNumber;
            PageSize = pageSize;
        }

        public PagedList(IEnumerable<T> items, int pageNumber, int pageSize, int totalItemCount)
        {
            _items = items?.ToArray() ?? new T[0];
            PageNumber = pageNumber;
            PageSize = pageSize;
            TotalItemCount = totalItemCount;
        }
        
        public int TotalItemCount { get; set; }
        
        public int PageNumber { get; set; }
        
        public int PageSize { get; set; }

        public int PageCount => ((TotalItemCount > 0) && (PageSize > 0)) ? ((TotalItemCount - 1) / PageSize + 1) : 1;

        public T[] Items
        {
            get => _items ??= new T[0];
            set => _items = value;
        }
    }
}