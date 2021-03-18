using System.Collections.Generic;
using System.Threading.Tasks;
using API.Dtos;
using API.Helpers.Params;
using API.Helpers.Utilities;

namespace API._Services.Interfaces
{
    public interface IProductService
    {
        Task<OperationResult> Create(Product_Dto model);
        Task<OperationResult> Update(Product_Dto model);
        Task<OperationResult> Remove(List<Product_Dto> model);
        Task<Product_Dto> GetProductByID(string productCateID, int productID);
        Task<List<Product_Dto>> GetAllAsync();
        Task<object> GetListProductByProductCateID(string productCateID);
        Task<PageListUtility<Product_Dto>> GetProductWithPaginations(PaginationParams param, string text, bool isPaging = true);
        Task<PageListUtility<Product_Dto>> SearchProductWithPaginations(PaginationParams param, string productCateID, string productName, bool isPaging = true);
    }
}