using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace API.Helpers.Utilities
{
    public class PageListUtility<T> where T : class
    {
        public PagedResultBase Pagination { get; set; }
        public List<T> Result { get; set; }

        public PageListUtility(List<T> items, int count, int pageNumber, int pageSize, int skip)
        {
            Result = items;
            Pagination = PagedResultBase.PageList(count, pageNumber, pageSize, skip);
        }

        /// <summary>
        /// Phân trang theo tiện ích IT Team
        /// </summary>
        /// <param name="source">Danh sách truyền vào</param>
        /// <param name="pageNumber">Trang hiện tại</param>
        /// <param name="pageSize">Số lượng dòng trên một trang</param>
        /// <returns> Một đối tượng PageListUtility theo kiểu data truyền vào </returns>
        public static async Task<PageListUtility<T>> PageListAsync(IQueryable<T> source, int pageNumber, int pageSize = 10, bool isPaging = true)
        {
            if (isPaging)
            {
                var count = await source.CountAsync();
                int skip = (pageNumber - 1) * pageSize;
                var items = await source.Skip(skip).Take(pageSize).ToListAsync();
                return new PageListUtility<T>(items, count, pageNumber, pageSize, skip);
            }
            else
            {
                var count = await source.CountAsync();
                int skip = (pageNumber - 1) * pageSize;
                var items = await source.ToListAsync();
                return new PageListUtility<T>(items, count, pageNumber, pageSize, skip);
            }
        }

        public static PageListUtility<T> PageList(List<T> source, int pageNumber, int pageSize = 10, bool isPaging = true)
        {
            if (isPaging)
            {
                var count = source.Count();
                int skip = (pageNumber - 1) * pageSize;
                var items = source.Skip(skip).Take(pageSize).ToList();
                return new PageListUtility<T>(items, count, pageNumber, pageSize, skip);
            }
            else
            {
                var count = source.Count();
                int skip = (pageNumber - 1) * pageSize;
                var items = source.ToList();
                return new PageListUtility<T>(items, count, pageNumber, pageSize, skip);
            }
        }
        public class PagedResultBase
        {
            public int CurrentPage { get; set; }
            public int TotalPage { get; set; }
            public int PageSize { get; set; }
            public int TotalCount { get; set; }
            public int Skip { get; set; }

            public PagedResultBase(int count, int pageNumber, int pageSize, int skip)
            {
                TotalCount = count;
                TotalPage = (int)Math.Ceiling(TotalCount / (double)pageSize);
                CurrentPage = pageNumber;
                PageSize = pageSize;
                Skip = skip;
            }
            public static PagedResultBase PageList(int count, int pageNumber, int pageSize, int skip)
            {
                return new PagedResultBase(count, pageNumber, pageSize, skip);
            }
        }
    }
}