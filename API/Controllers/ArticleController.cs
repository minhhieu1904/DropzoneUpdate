using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API._Repositories.Interfaces;
using API._Services.Interfaces;
using API.Dtos;
using API.Helpers.Params;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class ArticleController : ApiController
    {
        private readonly IArticleService _articleService;
        private readonly IDropzoneService _dropzoneService;
        private readonly IArticleRepository _articleRepository;

        public ArticleController(
            IArticleService articleService,
            IDropzoneService dropzoneService, 
            IArticleRepository articleRepository)
        {
            _articleService = articleService;
            _dropzoneService = dropzoneService;
            _articleRepository = articleRepository;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] Article_Dto model)
        {
            model.FileImages = await _dropzoneService.UploadFile(model.Images, model.Article_Cate_ID + "_" + model.Article_ID + "_", "\\uploaded\\images\\article");
            model.FileVideos = await _dropzoneService.UploadFile(model.Videos, model.Article_Cate_ID + "_" + model.Article_ID + "_", "\\uploaded\\video\\article");
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
        public async Task<IActionResult> Update([FromForm] Article_Dto model)
        {
            if (model.FileImages == "null")
            {
                model.FileImages = "";
            }
            if (model.FileVideos == "null")
            {
                model.FileVideos = "";
            }

            // Delete images, videos old
            var images = await _articleRepository.FindAll(x => x.Article_Cate_ID == model.Article_Cate_ID &&
                                                    x.Article_ID == model.Article_ID &&
                                                    x.Article_Name == model.Article_Name).Select(x => x.FileImages).Distinct().FirstOrDefaultAsync();

            var videos = await _articleRepository.FindAll(x => x.Article_Cate_ID == model.Article_Cate_ID &&
                                                    x.Article_ID == model.Article_ID &&
                                                    x.Article_Name == model.Article_Name).Select(x => x.FileVideos).Distinct().FirstOrDefaultAsync();
            if (!string.IsNullOrEmpty(images))
            {
                _dropzoneService.DeleteFileUpload(images, "\\uploaded\\images\\article");
            }
            if (!string.IsNullOrEmpty(videos))
            {
                _dropzoneService.DeleteFileUpload(videos, "\\uploaded\\video\\article");
            }

            // Add images, videos
            model.FileImages = null;
            model.FileVideos = null;

            model.FileImages = await _dropzoneService.UploadFile(model.Images, model.Article_Cate_ID + "_" + model.Article_ID + "_", "\\uploaded\\images\\article");
            model.FileVideos = await _dropzoneService.UploadFile(model.Videos, model.Article_Cate_ID + "_" + model.Article_ID + "_", "\\uploaded\\video\\article");

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

        [HttpPost("delete")]
        public async Task<IActionResult> Remove(Article_Dto model)
        {
            var images = await _articleRepository.FindAll(x => x.Article_Cate_ID == model.Article_Cate_ID &&
                                                    x.Article_ID == model.Article_ID &&
                                                    x.Article_Name == model.Article_Name).Select(x => x.FileImages).Distinct().FirstOrDefaultAsync();

            var videos = await _articleRepository.FindAll(x => x.Article_Cate_ID == model.Article_Cate_ID &&
                                                    x.Article_ID == model.Article_ID &&
                                                    x.Article_Name == model.Article_Name).Select(x => x.FileVideos).Distinct().FirstOrDefaultAsync();
            if (!string.IsNullOrEmpty(images))
            {
                _dropzoneService.DeleteFileUpload(images, "\\uploaded\\images\\article");
            }
            if (!string.IsNullOrEmpty(videos))
            {
                _dropzoneService.DeleteFileUpload(videos, "\\uploaded\\video\\article");
            }
            var data = await _articleService.Remove(model);
            return Ok(data);
        }
    }
}