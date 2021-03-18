using System.Collections.Generic;
using System.Threading.Tasks;
using API.Dtos;
using API.Helpers.Params;
using API.Helpers.Utilities;

namespace API._Services.Interfaces
{
    public interface IProductCategoryService
    {
        Task<OperationResult> Create(ProductCategory_Dto model);
        Task<OperationResult> Update(ProductCategory_Dto model);
        Task<OperationResult> Remove(List<ProductCategory_Dto> model);
        Task<ProductCategory_Dto> GetProductCategoryByID(string productCateID);
        Task<List<ProductCategory_Dto>> GetAllAsync();
        Task<object> GetIDAndName();
        Task<PageListUtility<ProductCategory_Dto>> GetProductCategoryWithPaginations(PaginationParams param, string text, bool isPaging = true);
        Task<OperationResult> ImportExcel(string pathFile, string user);
    }
}