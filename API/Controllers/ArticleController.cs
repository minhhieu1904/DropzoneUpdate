using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API._Repositories.Interfaces;
using API._Services.Interfaces;
using API.Dtos;
using API.Helpers.Params;
using API.Helpers.Utilities;
using Aspose.Cells;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class ArticleController : ApiController
    {
        private readonly IArticleService _articleService;
        private readonly IDropzoneService _dropzoneService;
        private readonly IArticleRepository _articleRepository;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public ArticleController(
            IArticleService articleService,
            IDropzoneService dropzoneService,
            IArticleRepository articleRepository,
            IWebHostEnvironment webHostEnvironment)
        {
            _articleService = articleService;
            _dropzoneService = dropzoneService;
            _articleRepository = articleRepository;
            _webHostEnvironment = webHostEnvironment;
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

        // Export Excel and PDF Article with Aspose.Cell
        [HttpGet("exportExcelAspose")]
        public async Task<ActionResult> ExportExcelAspose([FromQuery] string articleCateID, string articleID, int changeExport)
        {
            var data = await _articleService.GetArticleByID(articleCateID, articleID.ToInt());
            var path = Path.Combine(_webHostEnvironment.ContentRootPath, "Resources\\Template\\Article\\ArticleTemplate.xlsx");
            WorkbookDesigner designer = new WorkbookDesigner();
            designer.Workbook = new Workbook(path);

            Cell cell = designer.Workbook.Worksheets[0].Cells["A1"];
            Worksheet ws = designer.Workbook.Worksheets[0];
            Cells cells = ws.Cells;

            designer.SetDataSource("result", data);
            designer.Process();

            Style style = designer.Workbook.CreateStyle();
            style.IsTextWrapped = true;
            style.VerticalAlignment = TextAlignmentType.Center;
            style.HorizontalAlignment = TextAlignmentType.Center;
            style.Borders[BorderType.BottomBorder].LineStyle = CellBorderType.Thin;
            style.Borders[BorderType.TopBorder].LineStyle = CellBorderType.Thin;
            style.Borders[BorderType.LeftBorder].LineStyle = CellBorderType.Thin;
            style.Borders[BorderType.RightBorder].LineStyle = CellBorderType.Thin;

            StyleFlag flg = new StyleFlag();
            flg.All = true;

            int index = 2;
            ws.Cells["A" + (index)].PutValue(data.Article_Cate_ID);
            ws.Cells["B" + (index)].PutValue(data.Article_Name);
            ws.Cells["C" + (index)].PutValue(data.Content);
            ws.Cells["D" + (index)].PutValue(data.Status);
            ws.Cells["E" + (index)].PutValue(data.Update_By);
            ws.Cells["F" + (index)].PutValue(data.Update_Time.ToString());

            string folderImage = _webHostEnvironment.WebRootPath + "\\uploaded\\images\\article\\";
            string folderVideo = _webHostEnvironment.WebRootPath + "\\uploaded\\video\\article\\";
            if (data.FileImages != null)
            {
                string[] listImage = data.FileImages.Split(";");
                foreach (var image in listImage)
                {
                    if (image != "")
                    {
                        Aspose.Cells.Drawing.Picture pic = ws.Pictures[ws.Pictures.Add(index - 1, 6, folderImage + image)];
                        pic.Height = 40;
                        pic.Width = 80;
                        pic.Top = 10;
                        pic.Left = 20;

                        ws.Cells.SetRowHeight(index - 1, 45);

                        index++;
                    }
                }
            }
            int index1 = 2;
            if (data.FileVideos != null)
            {
                string[] listVideo = data.FileVideos.Split(";");
                foreach (var video in listVideo)
                {
                    if (video != "")
                    {
                        Aspose.Cells.Drawing.Picture pic = ws.Pictures[ws.Pictures.Add(index1 - 1, 7, folderVideo + "video.jpg")];
                        pic.Height = 40;
                        pic.Width = 80;
                        pic.Top = 10;
                        pic.Left = 20;

                        ws.Cells.SetRowHeight(index1 - 1, 45);

                        index1++;
                    }
                }
            }

            if (data.FileVideos != null || data.FileImages != null)
            {
                int index3 = 0;
                if (index > index1 || index == index1)
                    index3 = index;
                else
                    index3 = index1;

                cells.Merge(1, 0, index3 - 2, 1);
                cells.Merge(1, 1, index3 - 2, 1);
                cells.Merge(1, 2, index3 - 2, 1);
                cells.Merge(1, 3, index3 - 2, 1);
                cells.Merge(1, 4, index3 - 2, 1);
                cells.Merge(1, 5, index3 - 2, 1);

                for (int i = 1; i < index3 - 1; i++)
                {
                    ws.Cells["A" + (i + 1)].SetStyle(style, flg);
                    ws.Cells["B" + (i + 1)].SetStyle(style, flg);
                    ws.Cells["C" + (i + 1)].SetStyle(style, flg);
                    ws.Cells["D" + (i + 1)].SetStyle(style, flg);
                    ws.Cells["E" + (i + 1)].SetStyle(style, flg);
                    ws.Cells["F" + (i + 1)].SetStyle(style, flg);
                    ws.Cells["G" + (i + 1)].SetStyle(style, flg);
                    ws.Cells["H" + (i + 1)].SetStyle(style, flg);
                }
            }

            MemoryStream stream = new MemoryStream();

            string fileKind = "";
            string fileExtension = "";

            if (changeExport == 1)
            {
                designer.Workbook.Save(stream, SaveFormat.Xlsx);
                fileKind = "application/xlsx";
                fileExtension = ".xlsx";
            }
            if (changeExport == 2)
            {
                // custom size ( width: in, height: in )
                ws.PageSetup.FitToPagesTall = 0;
                ws.PageSetup.SetHeader(0, "&D &T");
                ws.PageSetup.SetHeader(1, "&B Article");
                ws.PageSetup.SetFooter(0, "&B SYSTEM BY MINH HIEU");
                ws.PageSetup.SetFooter(2, "&P/&N");
                ws.PageSetup.PrintQuality = 1200;
                designer.Workbook.Save(stream, SaveFormat.Pdf);
                fileKind = "application/pdf";
                fileExtension = ".pdf";
            }

            byte[] result = stream.ToArray();

            return File(result, fileKind, "Article_" + DateTime.Now.ToString("dd_MM_yyyy_HH_mm_ss") + fileExtension);
        }
    }
}