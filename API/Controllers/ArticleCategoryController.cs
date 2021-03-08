using System;
using System.Drawing;
using System.IO;
using System.Security.Claims;
using System.Threading.Tasks;
using API._Services.Interfaces;
using API.Dtos;
using API.Helpers.Params;
using Aspose.Cells;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;
using OfficeOpenXml.Drawing;
using OfficeOpenXml.Style;

namespace API.Controllers
{
    public class ArticleCategoryController : ApiController
    {
        private readonly IArticleCategoryService _articleCategoryService;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public ArticleCategoryController(
            IArticleCategoryService articleCategoryService,
            IWebHostEnvironment webHostEnvironment)
        {
            _articleCategoryService = articleCategoryService;
            _webHostEnvironment = webHostEnvironment;
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

        [HttpPost("delete")]
        public async Task<IActionResult> Remove(ArticleCategory_Dto model)
        {
            var data = await _articleCategoryService.Remove(model);
            return Ok(data);
        }

        // Import Data Excel
        [HttpPost("import")]
        public async Task<ActionResult> ImportExcel(IFormFile files)
        {
            if (files != null)
            {
                string fileNameExtension = (files.FileName.Split("."))[(files.FileName.Split(".")).Length - 1];
                string fileName = "Upload_Excel_ProductCate_" + DateTime.Now.ToString().Replace(":", "").Replace("/", "").Replace(" ", "") + "." + fileNameExtension;

                string folder = _webHostEnvironment.WebRootPath + $@"\uploaded\excels\ArticleCategory";
                if (!Directory.Exists(folder))
                {
                    Directory.CreateDirectory(folder);
                }
                string filePath = Path.Combine(folder, fileName);
                using (FileStream fs = System.IO.File.Create(filePath))
                {
                    files.CopyTo(fs);
                    fs.Flush();
                }

                return Ok(await _articleCategoryService.ImportExcel(filePath, User.FindFirst(ClaimTypes.Name).Value));
            }
            throw new Exception("Import Excel Article Category failed on save");
        }

        // Export Excel Epplus
        [HttpGet("exportExcelEpplus")]
        public async Task<ActionResult> ExportExcelEpplus([FromQuery] PaginationParams param, string text)
        {
            var data = await _articleCategoryService.GetArticleCategoryWithPaginations(param, text, false);

            var stream = new MemoryStream();
            using (var package = new ExcelPackage(stream))
            {
                // Define excel file
                var workSheet = package.Workbook.Worksheets.Add("Sheet1");

                // Add header
                workSheet.Row(1).Style.WrapText = true;
                workSheet.Row(1).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Row(1).Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                workSheet.Row(1).Style.Font.Bold = true;
                workSheet.Row(1).Height = 40;
                workSheet.Column(7).Style.Numberformat.Format = "yyyy/MM/dd";
                workSheet.Cells[1, 1, 1, 7].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                workSheet.Cells[1, 1, 1, 7].Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#20a8d8"));
                workSheet.Cells[1, 1, 1, 7].Style.Font.Color.SetColor(Color.White);
                workSheet.Cells[1, 1, 1, 7].Style.Font.Size = 14;
                workSheet.Cells[1, 1].Value = "#";
                workSheet.Cells[1, 2].Value = "Article Cate ID";
                workSheet.Cells[1, 3].Value = "Article Cate Name";
                workSheet.Cells[1, 4].Value = "Status";
                workSheet.Cells[1, 5].Value = "Position";
                workSheet.Cells[1, 6].Value = "Update By";
                workSheet.Cells[1, 7].Value = "Update Time";
                for (int i = 1; i < 8; i++)
                {
                    workSheet.Cells[1, i].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                    workSheet.Cells[1, i].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                    workSheet.Cells[1, i].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                    workSheet.Cells[1, i].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                }

                // Add body
                int index = 2;
                foreach (var item in data.Result)
                {
                    workSheet.Cells[index, 1].Value = (index - 1);
                    workSheet.Cells[index, 2].Value = item.Article_Cate_ID;
                    workSheet.Cells[index, 3].Value = item.Article_Cate_Name;
                    workSheet.Cells[index, 5].Value = item.Position;
                    workSheet.Cells[index, 6].Value = item.Update_By;
                    workSheet.Cells[index, 7].Value = item.Update_Time;
                    workSheet.Cells[index, 7].Style.Numberformat.Format = "yyyy/MM/dd hh:mm:ss";

                    workSheet.Cells[index, 1, index, 7].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                    workSheet.Cells[index, 1, index, 7].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                    workSheet.Cells[index, 1, index, 7].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                    workSheet.Cells[index, 1, index, 7].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;

                    workSheet.Row(index).Style.WrapText = true;
                    workSheet.Row(index).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    workSheet.Row(index).Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                    workSheet.Row(index).Height = 30;

                    string file = "";
                    if (item.Status == true)
                    {
                        file = _webHostEnvironment.WebRootPath + "\\icons\\ok-512.png";
                    }
                    else
                    {
                        file = _webHostEnvironment.WebRootPath + "\\icons\\circle-outline-512.png";
                    }
                    Image img = Image.FromFile(file);
                    ExcelPicture pic = workSheet.Drawings.AddPicture(index.ToString(), img);
                    // position image custom (row, top, col, left) : px
                    pic.SetPosition(index - 1, 10, 3, 45);
                    pic.SetSize(20, 20);

                    index++;
                }
                workSheet.Column(1).AutoFit(10);
                workSheet.Column(2).AutoFit(20);
                workSheet.Column(3).AutoFit(40);
                workSheet.Column(4).AutoFit(15);
                workSheet.Column(5).AutoFit(15);
                workSheet.Column(6).AutoFit(20);
                workSheet.Column(7).AutoFit(20);
                package.Save();
            }

            // Export
            stream.Position = 0;
            return File(stream, "application/xlsx", "Article_Category_" + Guid.NewGuid().ToString() + ".xlsx");
        }

        //Export Excel Aspose.Cell
        [HttpGet("exportExcelAspose")]
        public async Task<ActionResult> ExportExcelAspose([FromQuery] PaginationParams param, string text, int checkExport)
        {
            var data = await _articleCategoryService.GetArticleCategoryWithPaginations(param, text, false);
            var path = Path.Combine(_webHostEnvironment.ContentRootPath, "Resources\\Template\\ArticleCategory\\ArticleCategoryListTemplate.xlsx");
            WorkbookDesigner designer = new WorkbookDesigner();
            designer.Workbook = new Workbook(path);

            Cell cell = designer.Workbook.Worksheets[0].Cells["A1"];

            Worksheet ws = designer.Workbook.Worksheets[0];

            designer.SetDataSource("result", data.Result);
            designer.Process();

            int index = 2;
            for (int i = 0; i < data.Result.Count; i++)
            {
                ws.Cells["A" + index].PutValue(i + 1);
                index++;
            }

            var index2 = 1;
            foreach (var item in data.Result)
            {
                string file = "";
                if (item.Status == true)
                {
                    file = _webHostEnvironment.WebRootPath + "\\icons\\ok-512.png";
                }
                else
                {
                    file = _webHostEnvironment.WebRootPath + "\\icons\\circle-outline-512.png";
                }
                Aspose.Cells.Drawing.Picture pic = ws.Pictures[ws.Pictures.Add(index2, 3, file)];
                pic.Height = 20;
                pic.Width = 20;
                pic.Top = 5;
                pic.Left = 40;

                index2++;
            }

            MemoryStream stream = new MemoryStream();

            string fileKind = "";
            string fileExtension = "";

            if (checkExport == 1)
            {
                designer.Workbook.Save(stream, SaveFormat.Xlsx);
                fileKind = "application/xlsx";
                fileExtension = ".xlsx";
            }
            if (checkExport == 2)
            {
                // custom size ( width: in, height: in )
                //ws.PageSetup.CustomPaperSize(12.5, 8);
                ws.PageSetup.FitToPagesTall = 0;
                ws.PageSetup.SetHeader(0, "&D &T");
                ws.PageSetup.SetHeader(1, "&B Article Category");
                ws.PageSetup.SetFooter(0, "&B SYSTEM BY MINH HIEU");
                ws.PageSetup.SetFooter(2, "&P/&N");
                ws.PageSetup.PrintQuality = 1200;
                designer.Workbook.Save(stream, SaveFormat.Pdf);
                fileKind = "application/pdf";
                fileExtension = ".pdf";
            }

            byte[] result = stream.ToArray();

            return File(result, fileKind, "Article_Category_" + DateTime.Now.ToString("dd_MM_yyyy_HH_mm_ss") + fileExtension);
        }
    }
}