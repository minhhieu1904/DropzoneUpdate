using System;
using System.Collections.Generic;
using System.IO;
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
using OfficeOpenXml;

namespace API._Services.Services
{
    public class ArticleCategoryService : IArticleCategoryService
    {
        private readonly IArticleCategoryRepository _articleCategoryRepository;
        private readonly IArticleRepository _articleRepository;
        private readonly IMapper _mapper;
        private readonly MapperConfiguration _configuration;
        private OperationResult operationResult;

        public ArticleCategoryService(
            IArticleCategoryRepository articleCategoryRepository,
            IMapper mapper,
            MapperConfiguration configuration, 
            IArticleRepository articleRepository)
        {
            _articleCategoryRepository = articleCategoryRepository;
            _mapper = mapper;
            _configuration = configuration;
            _articleRepository = articleRepository;
        }

        public async Task<OperationResult> Create(ArticleCategory_Dto model)
        {
            model.Article_Cate_ID = await GetArticleCategoryID();
            var data = _mapper.Map<ArticleCategory>(model);
            try
            {
                _articleCategoryRepository.Add(data);
                await _articleCategoryRepository.Save();
                operationResult = new OperationResult { Success = true, Message = "Article Category was successfully added." };
            }
            catch (System.Exception)
            {
                operationResult = new OperationResult { Success = false, Message = "Article Category was exists." };
            }
            return operationResult;
        }

        public async Task<ArticleCategory_Dto> GetArticleCategoryByID(string articleCateID)
        {
            return await _articleCategoryRepository.FindAll(x => x.Article_Cate_ID == articleCateID)
            .ProjectTo<ArticleCategory_Dto>(_configuration).FirstOrDefaultAsync();
        }

        public async Task<List<ArticleCategory_Dto>> GetAllAsync()
        {
            return await _articleCategoryRepository.FindAll().ProjectTo<ArticleCategory_Dto>(_configuration).ToListAsync();
        }

        public async Task<PageListUtility<ArticleCategory_Dto>> GetArticleCategoryWithPaginations(PaginationParams param, string text, bool isPaging = true)
        {
            var data = _articleCategoryRepository.FindAll().ProjectTo<ArticleCategory_Dto>(_configuration).OrderByDescending(x => x.Update_Time);
            if (text != null)
            {
                data = data.Where(x => x.Article_Cate_Name.ToLower().Contains(text.ToLower())
                || x.Update_By.ToLower().Contains(text.ToLower())
                || x.Article_Cate_ID.ToLower().Contains(text.ToLower())).OrderByDescending(x => x.Update_Time);
            }
            return await PageListUtility<ArticleCategory_Dto>.PageListAsync(data, param.PageNumber, param.PageSize);
        }

        public async Task<OperationResult> Update(ArticleCategory_Dto model)
        {
            var data = _mapper.Map<ArticleCategory>(model);
            try
            {
                _articleCategoryRepository.Update(data);
                await _articleCategoryRepository.Save();
                operationResult = new OperationResult { Success = true, Message = "Article Category was successfully updated." };
            }
            catch (System.Exception)
            {
                operationResult = new OperationResult { Success = false, Message = "Article Category was failes updated." };
            }

            return operationResult;
        }

        public async Task<OperationResult> Remove(ArticleCategory_Dto model)
        {
            var item = await _articleCategoryRepository.FindAll(x => x.Article_Cate_ID == model.Article_Cate_ID).FirstOrDefaultAsync();
            var articles = await _articleRepository.FindAll(x => x.Article_Cate_ID == model.Article_Cate_ID).ToListAsync();
            if (item != null && articles.Count == 0)
            {
                try
                {
                    _articleCategoryRepository.Remove(item);
                    await _articleCategoryRepository.Save();
                    operationResult = new OperationResult { Success = true, Message = "Article Category was delete successfully." };

                }
                catch (System.Exception)
                {
                    operationResult = new OperationResult { Success = false, Message = "Article Category was delete failes." };
                }
            }
            else
            {
                operationResult = new OperationResult { Success = false, Message = "Article Category was delete failes." };
            }

            return operationResult;
        }

        public async Task<string> GetArticleCategoryID()
        {
            string articleCateID = "Article";
            var items = await _articleCategoryRepository.FindAll(x => x.Article_Cate_ID.Contains(articleCateID))
                .OrderByDescending(x => x.Article_Cate_ID).FirstOrDefaultAsync();
            if (items != null)
            {
                var serinumber = items.Article_Cate_ID.Substring(8).ToInt();
                var tmp = (serinumber >= 999) ? (serinumber + 1).ToString() :
                    (serinumber >= 99) ? ("0" + (serinumber + 1)) :
                        (serinumber < 9) ? ("000" + (serinumber + 1)) : ("00" + (serinumber + 1));
                articleCateID = "Article" + tmp;
            }
            else
            {
                articleCateID = "Article0001";
            }
            return articleCateID;
        }

        public async Task<object> GetIDAndName()
        {
            var data = await _articleCategoryRepository.FindAll()
            .Select(x => new { Id = x.Article_Cate_ID, Name = x.Article_Cate_ID + "_" + x.Article_Cate_Name}).ToListAsync();
            return data;
        }

        public async Task<OperationResult> ImportExcel(string pathFile, string user)
        {
            List<ArticleCategory_Dto> listArticleCategory = new List<ArticleCategory_Dto>();
            using (var package = new ExcelPackage(new FileInfo(pathFile)))
            {
                ExcelWorksheet workSheet = package.Workbook.Worksheets[0];
                int totalRows = workSheet.Dimension.Rows;
                for (int i = 2; i <= totalRows; i++)
                {
                    ArticleCategory_Dto articleCategory = new ArticleCategory_Dto();
                    articleCategory.Article_Cate_Name = workSheet.Cells[i, 1].Value.ToSafetyString().Trim();
                    articleCategory.Status = workSheet.Cells[i, 2].Value.ToBool();
                    articleCategory.Position = workSheet.Cells[i, 3].Value.ToInt();
                    articleCategory.Update_By = user;

                    listArticleCategory.Add(articleCategory);
                }
                foreach (var item in listArticleCategory)
                {
                    item.Update_Time = DateTime.Now;
                    try
                    {
                        await Create(item);
                        operationResult = new OperationResult { Message = "Import Success", Success = true };
                    }
                    catch
                    {
                        operationResult = new OperationResult { Message = "Import Faild", Success = false };
                    }
                }
            }
            return await Task.FromResult(operationResult);
        }
    }
}