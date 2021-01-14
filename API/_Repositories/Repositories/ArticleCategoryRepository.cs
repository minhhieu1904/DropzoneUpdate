using API._Repositories.Interfaces;
using API.Data;
using API.Models;

namespace API._Repositories.Repositories
{
    public class ArticleCategoryRepository : Repository<ArticleCategory>, IArticleCategoryRepository
    {
        public ArticleCategoryRepository(DBContext context) : base(context)
        {
        }
    }
}