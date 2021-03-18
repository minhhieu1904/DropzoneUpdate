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
        Task<OperationResult> Remove(List<Article_Dto> model);
        Task<Article_Dto> GetArticleByID(string articleCateID, int articleID);
        Task<List<Article_Dto>> GetAllAsync();
        Task<object> GetListArticleByArticleCateID(string articleCateID);
        Task<PageListUtility<Article_Dto>> GetArticleWithPaginations(PaginationParams param, string text, bool isPaging = true);
        Task<PageListUtility<Article_Dto>> SearchArticleWithPaginations(PaginationParams param, string articleCateID, string articleName, bool isPaging = true);
    }
}