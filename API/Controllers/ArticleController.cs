using System;
using System.Security.Claims;
using System.Threading.Tasks;
using API._Services.Interfaces;
using API.Dtos;
using API.Helpers.Params;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ArticleController : ApiController
    {
        private readonly IArticleService _articleService;

        public ArticleController(IArticleService articleService)
        {
            _articleService = articleService;
        }

        [HttpPost]
        public async Task<IActionResult> Create(Article_Dto model)
        {
            model.Update_By = User.FindFirst(ClaimTypes.Name).Value;
            model.Update_Time = DateTime.Now;
            var data = await _articleService.Create(model);
            return Ok(data);
        }

        [HttpGet]
        public async Task<IActionResult> GetArticleByID(string articleCateID, int articleID)
        {
            var data = await _articleService.GetArticleByID(articleCateID, articleID);
            return Ok(data);
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllAsync()
        {
            var data = await _articleService.GetAllAsync();
            return Ok(data);
        }

        [HttpGet("articleID")]
        public async Task<IActionResult> GetListArticleByArticleCateID(string articleCateID)
        {
            var data = await _articleService.GetListArticleByArticleCateID(articleCateID);
            return Ok(data);
        }

        [HttpGet("pagination")]
        public async Task<IActionResult> GetArticleWithPaginations([FromQuery] PaginationParams param, string text)
        {
            var data = await _articleService.GetArticleWithPaginations(param, text);
            return Ok(data);
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchArticleWithPaginations([FromQuery] PaginationParams param, string articleCateID, string articleName)
        {
            var data = await _articleService.SearchArticleWithPaginations(param, articleCateID, articleName);
            return Ok(data);
        }

        [HttpPut]
        public async Task<IActionResult> Update(Article_Dto model)
        {
            model.Update_By = User.FindFirst(ClaimTypes.Name).Value;
            model.Update_Time = DateTime.Now;
            var data = await _articleService.Update(model);
            return Ok(data);
        }

        [HttpPut("changeStatus")]
        public async Task<IActionResult> ChangeStatus(Article_Dto model)
        {
            model.Update_By = User.FindFirst(ClaimTypes.Name).Value;
            model.Update_Time = DateTime.Now;
            model.Status = !model.Status;
            var data = await _articleService.Update(model);
            return Ok(data);
        }

        [HttpDelete]
        public async Task<IActionResult> Remove(string articleCateID, int articleID)
        {
            var data = await _articleService.Remove(articleCateID, articleID);
            return Ok(data);
        }
    }
}