using System;
using System.Security.Claims;
using System.Threading.Tasks;
using API._Services.Interfaces;
using API.Dtos;
using API.Helpers.Params;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ArticleCategoryController : ApiController
    {
        private readonly IArticleCategoryService _articleCategoryService;

        public ArticleCategoryController(IArticleCategoryService articleCategoryService)
        {
            _articleCategoryService = articleCategoryService;
        }

        [HttpPost]
        public async Task<IActionResult> Create(ArticleCategory_Dto model)
        {
            model.Update_By = User.FindFirst(ClaimTypes.Name).Value;
            model.Update_Time = DateTime.Now;
            var data = await _articleCategoryService.Create(model);
            return Ok(data);
        }

        [HttpGet]
        public async Task<IActionResult> GetArticleCategoryByID(string articleCateID)
        {
            var data = await _articleCategoryService.GetArticleCategoryByID(articleCateID);
            return Ok(data);
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllAsync()
        {
            var data = await _articleCategoryService.GetAllAsync();
            return Ok(data);
        }

        [HttpGet("name")]
        public async Task<IActionResult> GetIDAndName()
        {
            var data = await _articleCategoryService.GetIDAndName();
            return Ok(data);
        }

        [HttpGet("pagination")]
        public async Task<IActionResult> GetArticleCategoryWithPaginations([FromQuery] PaginationParams param, string text)
        {
            var data = await _articleCategoryService.GetArticleCategoryWithPaginations(param, text);
            return Ok(data);
        }

        [HttpPut]
        public async Task<IActionResult> Update(ArticleCategory_Dto model)
        {
            model.Update_By = User.FindFirst(ClaimTypes.Name).Value;
            model.Update_Time = DateTime.Now;
            var data = await _articleCategoryService.Update(model);
            return Ok(data);
        }

        [HttpPut("changeStatus")]
        public async Task<IActionResult> ChangeStatus(ArticleCategory_Dto model)
        {
            model.Update_By = User.FindFirst(ClaimTypes.Name).Value;
            model.Update_Time = DateTime.Now;
            model.Status = !model.Status;
            var data = await _articleCategoryService.Update(model);
            return Ok(data);
        }

        [HttpDelete]
        public async Task<IActionResult> Remove(string articleCateID)
        {
            var data = await _articleCategoryService.Remove(articleCateID);
            return Ok(data);
        }
    }
}