using System;
using System.Collections.Generic;
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
    public class ProductController : ApiController
    {
        private readonly IProductService _productService;
        private readonly IDropzoneService _dropzoneService;
        private readonly IProductRepository _productRepository;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public ProductController(
            IProductService productService,
            IWebHostEnvironment webHostEnvironment,
            IProductRepository productRepository,
            IDropzoneService dropzoneService)
        {
            _productService = productService;
            _webHostEnvironment = webHostEnvironment;
            _productRepository = productRepository;
            _dropzoneService = dropzoneService;
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromForm] Product_Dto model)
        {
            if (model.Images != null)
                model.FileImages = await _dropzoneService.UploadFile(model.Images, model.Product_Cate_ID + "_" + model.Product_ID + "_", "\\uploaded\\images\\product");
            if (model.Videos != null)
                model.FileVideos = await _dropzoneService.UploadFile(model.Videos, model.Product_Cate_ID + "_" + model.Product_ID + "_", "\\uploaded\\video\\product");
            model.Update_By = User.FindFirst(ClaimTypes.Name).Value;
            model.Update_Time = DateTime.Now;
            model.Content = model.Content == "null" ? null : model.Content;
            return Ok(await _productService.Create(model));
        }

        [HttpGet]
        public async Task<IActionResult> GetProductByID(string productCateID, int productID)
        {
            return Ok(await _productService.GetProductByID(productCateID, productID));
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllAsync()
        {
            return Ok(await _productService.GetAllAsync());
        }

        [HttpGet("productID")]
        public async Task<IActionResult> GetListProductByProductCateID(string productCateID)
        {
            return Ok(await _productService.GetListProductByProductCateID(productCateID));
        }

        [HttpGet("pagination")]
        public async Task<IActionResult> GetProductWithPaginations([FromQuery] PaginationParams param, string text)
        {
            return Ok(await _productService.GetProductWithPaginations(param, text, false));
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchProductWithPaginations([FromQuery] PaginationParams param, string productCateID, string productName)
        {
            return Ok(await _productService.SearchProductWithPaginations(param, productCateID, productName, false));
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromForm] Product_Dto model)
        {
            model.Content = model.Content == "null" ? null : model.Content;

            // Delete images, videos old
            var images = await _productRepository.FindAll(x => x.Product_Cate_ID == model.Product_Cate_ID &&
                                                    x.Product_ID == model.Product_ID &&
                                                    x.Product_Name == model.Product_Name).Select(x => x.FileImages).Distinct().FirstOrDefaultAsync();

            var videos = await _productRepository.FindAll(x => x.Product_Cate_ID == model.Product_Cate_ID &&
                                                    x.Product_ID == model.Product_ID &&
                                                    x.Product_Name == model.Product_Name).Select(x => x.FileVideos).Distinct().FirstOrDefaultAsync();
            if (!string.IsNullOrEmpty(images))
                _dropzoneService.DeleteFileUpload(images, "\\uploaded\\images\\product");
            if (!string.IsNullOrEmpty(videos))
                _dropzoneService.DeleteFileUpload(videos, "\\uploaded\\video\\product");

            // Add images, videos
            model.FileImages = null;
            model.FileVideos = null;

            if (model.Images != null)
                model.FileImages = await _dropzoneService.UploadFile(model.Images, model.Product_Cate_ID + "_" + model.Product_ID + "_", "\\uploaded\\images\\product");
            if (model.Videos != null)
                model.FileVideos = await _dropzoneService.UploadFile(model.Videos, model.Product_Cate_ID + "_" + model.Product_ID + "_", "\\uploaded\\video\\product");

            model.Update_By = User.FindFirst(ClaimTypes.Name).Value;
            model.Update_Time = DateTime.Now;
            return Ok(await _productService.Update(model));
        }

        [HttpPut("changeNew")]
        public async Task<IActionResult> ChangeNew(Product_Dto model)
        {
            model.Update_By = User.FindFirst(ClaimTypes.Name).Value;
            model.Update_Time = DateTime.Now;
            model.New = !model.New;
            return Ok(await _productService.Update(model));
        }

        [HttpPut("changeHotSale")]
        public async Task<IActionResult> ChangeHotSale(Product_Dto model)
        {
            model.Update_By = User.FindFirst(ClaimTypes.Name).Value;
            model.Update_Time = DateTime.Now;
            model.Hot_Sale = !model.Hot_Sale;
            return Ok(await _productService.Update(model));
        }

        [HttpPut("changeIsSale")]
        public async Task<IActionResult> ChangeIsSale(Product_Dto model)
        {
            model.Update_By = User.FindFirst(ClaimTypes.Name).Value;
            model.Update_Time = DateTime.Now;
            model.IsSale = !model.IsSale;
            if (model.IsSale == false)
            {
                model.Time_Sale = 0;
                model.From_Date_Sale = null;
                model.To_Date_Sale = null;
            }
            return Ok(await _productService.Update(model));
        }

        [HttpPut("changeStatus")]
        public async Task<IActionResult> ChangeStatus(Product_Dto model)
        {
            model.Update_By = User.FindFirst(ClaimTypes.Name).Value;
            model.Update_Time = DateTime.Now;
            model.Status = !model.Status;
            return Ok(await _productService.Update(model));
        }

        [HttpPost("delete")]
        public async Task<IActionResult> Remove(List<Product_Dto> model)
        {
            foreach (var item in model)
            {
                var images = await _productRepository.FindAll(x => x.Product_Cate_ID == item.Product_Cate_ID &&
                                                        x.Product_ID == item.Product_ID &&
                                                        x.Product_Name == item.Product_Name).Select(x => x.FileImages).Distinct().FirstOrDefaultAsync();

                var videos = await _productRepository.FindAll(x => x.Product_Cate_ID == item.Product_Cate_ID &&
                                                        x.Product_ID == item.Product_ID &&
                                                        x.Product_Name == item.Product_Name).Select(x => x.FileVideos).Distinct().FirstOrDefaultAsync();
                if (!string.IsNullOrEmpty(images))
                    _dropzoneService.DeleteFileUpload(images, "\\uploaded\\images\\product");
                if (!string.IsNullOrEmpty(videos))
                    _dropzoneService.DeleteFileUpload(videos, "\\uploaded\\video\\product");
            }

            return Ok(await _productService.Remove(model));
        }

        // Export Excel and PDF Product List with Aspose.Cell
        [HttpGet("exportExcelListAspose")]
        public async Task<ActionResult> ExportExcelListAspose([FromQuery] PaginationParams param, string text, int checkExport, string productCateID, string productName, int checkSearch)
        {
            PageListUtility<Product_Dto> data;
            if (checkSearch == 1)
                data = await _productService.GetProductWithPaginations(param, text, false);
            else
                data = await _productService.SearchProductWithPaginations(param, productCateID, productName, false);
            var path = Path.Combine(_webHostEnvironment.ContentRootPath, "Resources\\Template\\Product\\ProductListTemplate.xlsx");
            WorkbookDesigner designer = new WorkbookDesigner();
            designer.Workbook = new Workbook(path);

            Cell cell = designer.Workbook.Worksheets[0].Cells["A1"];
            Worksheet ws = designer.Workbook.Worksheets[0];

            designer.SetDataSource("result", data.Result);
            designer.Process();

            Style styleDecimal = ws.Cells["G2"].GetStyle();
            styleDecimal.Custom = "0.00";

            Style styleDateTime = ws.Cells["J2"].GetStyle();
            styleDateTime.Custom = "dd/MM/yyyy hh:mm:ss";

            for (int i = 1; i <= data.Result.Count; i++)
            {
                ws.AutoFitRow(i);
                ws.Cells["G" + (i + 1)].SetStyle(styleDecimal);
                ws.Cells["J" + (i + 1)].SetStyle(styleDateTime);
            }

            int index = 2;
            foreach (var item in data.Result)
            {
                string fileNew = _dropzoneService.CheckTrueFalse(item.New);
                string fileIsSale = _dropzoneService.CheckTrueFalse(item.IsSale);
                string fileHotSale = _dropzoneService.CheckTrueFalse(item.Hot_Sale);
                string fileStatus = _dropzoneService.CheckTrueFalse(item.Status);

                Aspose.Cells.Drawing.Picture iconNew = ws.Pictures[ws.Pictures.Add(1, 2, fileNew)];
                Aspose.Cells.Drawing.Picture iconIsSale = ws.Pictures[ws.Pictures.Add(1, 3, fileIsSale)];
                Aspose.Cells.Drawing.Picture iconHotSale = ws.Pictures[ws.Pictures.Add(1, 4, fileHotSale)];
                Aspose.Cells.Drawing.Picture iconStatus = ws.Pictures[ws.Pictures.Add(1, 5, fileStatus)];

                iconNew.Height = iconIsSale.Height = iconHotSale.Height = iconStatus.Height = 20;
                iconNew.Width = iconIsSale.Width = iconHotSale.Width = iconStatus.Width = 20;
                iconNew.Top = iconIsSale.Top = iconHotSale.Top = iconStatus.Top = 5;
                iconNew.Left = iconIsSale.Left = iconHotSale.Left = iconStatus.Left = 40;

                ws.Cells.SetRowHeight(index - 1, 22.5);
                index++;
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

            return File(result, fileKind, "Product_List_" + DateTime.Now.ToString("dd_MM_yyyy_HH_mm_ss") + fileExtension);
        }

        // Export Excel and PDF Product Detail with Aspose.Cell
        [HttpGet("exportExcelDetailAspose")]
        public async Task<ActionResult> ExportExcelDetailAspose([FromQuery] string productCateID, string productID, int checkExport)
        {
            var data = await _productService.GetProductByID(productCateID, productID.ToInt());
            var path = Path.Combine(_webHostEnvironment.ContentRootPath, "Resources\\Template\\Product\\ProductDetailTemplate.xlsx");
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
            ws.Cells["A" + (index)].PutValue(data.Product_Cate_ID);
            ws.Cells["B" + (index)].PutValue(data.Product_Name);
            ws.Cells["G" + (index)].PutValue(data.Price);
            ws.Cells["H" + (index)].PutValue(data.Amount);
            ws.Cells["I" + (index)].PutValue(data.Update_By);
            ws.Cells["J" + (index)].PutValue(data.Update_Time.ToString());

            string folderImage = _webHostEnvironment.WebRootPath + "\\uploaded\\images\\product\\";
            string folderVideo = _webHostEnvironment.WebRootPath + "\\uploaded\\video\\product\\";
            if (data.FileImages != null)
            {
                string[] listImage = data.FileImages.Split(";");
                foreach (var image in listImage)
                {
                    if (image != "")
                    {
                        Aspose.Cells.Drawing.Picture pic = ws.Pictures[ws.Pictures.Add(index - 1, 10, folderImage + image)];
                        pic = await StyleImageExcel(pic);
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
                        Aspose.Cells.Drawing.Picture pic = ws.Pictures[ws.Pictures.Add(index1 - 1, 11, folderVideo + "video.jpg")];
                        pic = await StyleImageExcel(pic);
                        ws.Cells.SetRowHeight(index1 - 1, 45);

                        index1++;
                    }
                }
            }

            if (data.FileVideos != null || data.FileImages != null)
            {
                int index3 = index >= index1 ? index : index1;

                // Merge column not image, video
                int[] number = { 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 };
                foreach (var item in number)
                {
                    cells.Merge(1, item, index3 - 2, 1);
                }
                // Set style
                for (int i = 1; i < index3 - 1; i++)
                {
                    string[] text = { "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L" };
                    foreach (var item in text)
                    {
                        ws.Cells[item + (i + 1)].SetStyle(style, flg);
                    }
                }
                string fileNew = _dropzoneService.CheckTrueFalse(data.New);
                string fileIsSale = _dropzoneService.CheckTrueFalse(data.IsSale);
                string fileHotSale = _dropzoneService.CheckTrueFalse(data.Hot_Sale);
                string fileStatus = _dropzoneService.CheckTrueFalse(data.Status);

                Aspose.Cells.Drawing.Picture iconNew = ws.Pictures[ws.Pictures.Add(1, 2, fileNew)];
                Aspose.Cells.Drawing.Picture iconIsSale = ws.Pictures[ws.Pictures.Add(1, 3, fileIsSale)];
                Aspose.Cells.Drawing.Picture iconHotSale = ws.Pictures[ws.Pictures.Add(1, 4, fileHotSale)];
                Aspose.Cells.Drawing.Picture iconStatus = ws.Pictures[ws.Pictures.Add(1, 5, fileStatus)];

                iconNew.Height = iconIsSale.Height = iconHotSale.Height = iconStatus.Height = 20;
                iconNew.Width = iconIsSale.Width = iconHotSale.Width = iconStatus.Width = 20;
                iconNew.Top = iconIsSale.Top = iconHotSale.Top = iconStatus.Top = 20 * (index3 - 2);
                iconNew.Left = iconIsSale.Left = iconHotSale.Left = iconStatus.Left = 40;
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
                ws.PageSetup.FitToPagesTall = 0;
                ws.PageSetup.SetHeader(0, "&D &T");
                ws.PageSetup.SetHeader(1, "&B Product");
                ws.PageSetup.SetFooter(0, "&B SYSTEM BY MINH HIEU");
                ws.PageSetup.SetFooter(2, "&P/&N");
                ws.PageSetup.PrintQuality = 2400;
                designer.Workbook.Save(stream, SaveFormat.Pdf);
                fileKind = "application/pdf";
                fileExtension = ".pdf";
            }
            byte[] result = stream.ToArray();

            return File(result, fileKind, "Product_Detail_" + DateTime.Now.ToString("dd_MM_yyyy_HH_mm_ss") + fileExtension);
        }

        private async Task<Aspose.Cells.Drawing.Picture> StyleImageExcel(Aspose.Cells.Drawing.Picture pic)
        {
            pic.Height = 40;
            pic.Width = 80;
            pic.Top = 10;
            pic.Left = 20;
            return await Task.FromResult(pic);
        }
    }
}