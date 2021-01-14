using System.Collections.Generic;
using System.Threading.Tasks;
using API.Dtos;
using API.Helpers.Params;
using API.Helpers.Utilities;

namespace API._Services.Interfaces
{
    public interface IArticleCategoryService
    {
        Task<OperationResult> Create(ArticleCategory_Dto model);
        Task<OperationResult> Update(ArticleCategory_Dto model);
        Task<OperationResult> Remove(string articleCateID);
        Task<ArticleCategory_Dto> GetArticleCategoryByID(string articleCateID);
        Task<List<ArticleCategory_Dto>> GetAllAsync();
        Task<object> GetIDAndName();
        Task<PageListUtility<ArticleCategory_Dto>> GetArticleCategoryWithPaginations(PaginationParams param, string text);
    }
}