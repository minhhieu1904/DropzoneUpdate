using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API._Repositories.Interfaces;
using API._Services.Interfaces;
using API.Dtos;
using API.Helpers.Params;
using API.Helpers.Utilities;
using API.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API._Services.Services
{
    public class ArticleService : IArticleService
    {
        private readonly IArticleRepository _articleRepository;
        private readonly IArticleCategoryRepository _articleCategoryRepository;
        private readonly IMapper _mapper;
        private readonly MapperConfiguration _configuration;
        private OperationResult operationResult;

        public ArticleService(
            IArticleRepository articleRepository,
            IMapper mapper,
            MapperConfiguration configuration, 
            IArticleCategoryRepository articleCategoryRepository)
        {
            _articleRepository = articleRepository;
            _mapper = mapper;
            _configuration = configuration;
            _articleCategoryRepository = articleCategoryRepository;
        }

        public async Task<OperationResult> Create(Article_Dto model)
        {
            var item = await GetArticleByID(model.Article_Cate_ID, model.Article_ID);
            var data = _mapper.Map<Article>(model);
            try
            {
                if (item == null)
                {
                    _articleRepository.Add(data);
                    await _articleRepository.Save();
                    operationResult = new OperationResult { Success = true, Message = "Article was successfully added." };
                }
                else
                {
                    operationResult = new OperationResult { Success = true, Message = "Article was exists." };
                }
            }
            catch (System.Exception ex)
            {
                operationResult = new OperationResult { Success = true, Message = ex.ToString() };
            }

            return operationResult;
        }

        public async Task<Article_Dto> GetArticleByID(string articleCateID, int articleID)
        {
            return await _articleRepository.FindAll(x => x.Article_Cate_ID == articleCateID && x.Article_ID == articleID)
            .ProjectTo<Article_Dto>(_configuration).FirstOrDefaultAsync();
        }

        public async Task<List<Article_Dto>> GetAllAsync()
        {
            return await _articleRepository.FindAll().ProjectTo<Article_Dto>(_configuration).ToListAsync();
        }

        public async Task<PageListUtility<Article_Dto>> GetArticleWithPaginations(PaginationParams param, string text)
        {
            var data = _articleRepository.FindAll().ProjectTo<Article_Dto>(_configuration).OrderByDescending(x => x.Article_Cate_ID).ThenBy(x => x.Article_ID);
            if (!string.IsNullOrEmpty(text))
            {
                data = data.Where(x => x.Article_ID.ToString().ToLower().Contains(text.ToLower())
                || x.Article_Name.ToLower().Contains(text.ToLower())
                || x.Update_By.ToLower().Contains(text.ToLower())
                || x.Content.ToLower().Contains(text.ToLower())
                || x.Alias.ToLower().Contains(text.ToLower())
                || x.Article_Cate_ID.ToLower().Contains(text.ToLower())
                ).OrderByDescending(x => x.Article_Cate_ID).ThenBy(x => x.Article_ID);
            }
            return await PageListUtility<Article_Dto>.PageListAsync(data, param.PageNumber, param.PageSize);
        }

        public async Task<OperationResult> Update(Article_Dto model)
        {
            var data = _mapper.Map<Article>(model);
            try
            {
                _articleRepository.Update(data);
                await _articleRepository.Save();
                operationResult = new OperationResult { Success = true, Message = "Article was successfully updated." };
            }
            catch (System.Exception ex)
            {
                operationResult = new OperationResult { Success = true, Message = ex.ToString() };
            }

            return operationResult;
        }

        public async Task<OperationResult> Remove(string articleCateID, int articleID)
        {
            var item = await GetArticleByID(articleCateID, articleID);
            try
            {
                if (item != null)
                {
                    _articleRepository.Remove(item);
                    await _articleRepository.Save();
                    operationResult = new OperationResult { Success = true, Message = "Article was delete successfully." };
                }
                else
                {
                    operationResult = new OperationResult { Success = true, Message = "Article was delete failse." };
                }
            }
            catch (System.Exception ex)
            {
                operationResult = new OperationResult { Success = true, Message = ex.ToString() };
            }

            return operationResult;
        }

        public async Task<PageListUtility<Article_Dto>> SearchArticleWithPaginations(PaginationParams param, string articleCateID, string articleName)
        {
            var articleCateList = _articleCategoryRepository.FindAll();
            var articleList = _articleRepository.FindAll();
            if(!string.IsNullOrEmpty(articleCateID)){
                articleCateList = articleCateList.Where(x => x.Article_Cate_ID == articleCateID);
            }
            if(!string.IsNullOrEmpty(articleName)){
                articleList = articleList.Where(x => x.Article_Name == articleName);
            }

            var query = articleCateList.Join(
                        articleList,
                        x => x.Article_Cate_ID, 
                        y => y.Article_Cate_ID, 
                        (x,y) => new Article_Dto 
                        {
                            Article_Cate_ID = y.Article_Cate_ID,
                            Alias = y.Alias,
                            Article_ID = y.Article_ID,
                            Article_Name = y.Article_Name,
                            Content = y.Content,
                            Files = y.Files,
                            Link = y.Link,
                            Status = y.Status,
                            Update_By = y.Update_By,
                            Update_Time = y.Update_Time
                        }).OrderByDescending(x => x.Article_Cate_ID).ThenBy(x => x.Article_ID);
            return await PageListUtility<Article_Dto>.PageListAsync(query, param.PageNumber, param.PageSize);
        }

        public async Task<object> GetListArticleByArticleCateID(string articleCateID)
        {
            var data = await _articleRepository.FindAll(x => x.Article_Cate_ID == articleCateID)
            .Select( x => new { Id = x.Article_Name, Name = x.Article_ID + "_" + x.Article_Name }).ToListAsync();
            return data;
        }
    }
}