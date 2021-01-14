using System.Collections.Generic;
using System.Threading.Tasks;
using API.Dtos;
using API.Helpers.Params;
using API.Helpers.Utilities;

namespace API._Services.Interfaces
{
    public interface IArticleService
    {
        Task<OperationResult> Create(Article_Dto model);
        Task<OperationResult> Update(Article_Dto model);
        Task<OperationResult> Remove(string articleCateID, int articleID);
        Task<Article_Dto> GetArticleByID(string articleCateID, int articleID);
        Task<List<Article_Dto>> GetAllAsync();
        Task<object> GetListArticleByArticleCateID(string articleCateID);
        Task<PageListUtility<Article_Dto>> GetArticleWithPaginations(PaginationParams param, string text);
        Task<PageListUtility<Article_Dto>> SearchArticleWithPaginations(PaginationParams param, string articleCateID, string articleName);
    }
}