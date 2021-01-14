using System;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Threading.Tasks;
using API._Repositories.Interfaces;
using API._Services.Interfaces;
using API.Dtos;
using API.Helpers.Params;
using API.Helpers.Utilities;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProductController : ApiController
    {
        private readonly IProductService _productService;
        private readonly IProductRepository _productRepository;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public ProductController(
            IProductService productService,
            IWebHostEnvironment webHostEnvironment,
            IProductRepository productRepository)
        {
            _productService = productService;
            _webHostEnvironment = webHostEnvironment;
            _productRepository = productRepository;
        }

        [HttpPost("uploadFile")]
        public async Task<IActionResult> Create([FromForm] Product_Dto model)
        {
            if (model.Images != null)
            {
                foreach (var item in model.Images)
                {
                    var filename = ContentDispositionHeaderValue.Parse(item.ContentDisposition).FileName.Trim('"');
                    var randomGiud = Guid.NewGuid().ToString();

                    var check = Path.GetExtension(filename);
                    var uploadPicture = model.Product_Cate_ID + "_" + model.Product_Name + "_" + randomGiud + check;
                    string folder = _webHostEnvironment.WebRootPath + "\\uploaded\\images";

                    if (!Directory.Exists(folder))
                    {
                        Directory.CreateDirectory(folder);
                    }
                    string filePath = Path.Combine(folder, uploadPicture);

                    using (FileStream fs = System.IO.File.Create(filePath))
                    {
                        item.CopyTo(fs);
                        fs.Flush();
                    }
                    model.FileImages += uploadPicture + ";";
                }
            }
            if (model.Videos != null)
            {
                foreach (var item in model.Videos)
                {
                    var filename = ContentDispositionHeaderValue.Parse(item.ContentDisposition).FileName.Trim('"');
                    var randomGiud = Guid.NewGuid().ToString();

                    var check = Path.GetExtension(filename);
                    var uploadVideo = model.Product_Cate_ID + "_" + model.Product_Name + "_" + randomGiud + check;
                    string folder = _webHostEnvironment.WebRootPath + "\\uploaded\\video";

                    if (!Directory.Exists(folder))
                    {
                        Directory.CreateDirectory(folder);
                    }
                    string filePath = Path.Combine(folder, uploadVideo);

                    using (FileStream fs = System.IO.File.Create(filePath))
                    {
                        item.CopyTo(fs);
                        fs.Flush();
                    }
                    model.FileVideos += uploadVideo + ";";
                }
            }
            model.Update_By = User.FindFirst(ClaimTypes.Name).Value;
            model.Update_Time = DateTime.Now;
            var data = await _productService.Create(model);
            return Ok(data);
        }

        [HttpGet]
        public async Task<IActionResult> GetProductByID(string productCateID, int productID)
        {
            var data = await _productService.GetProductByID(productCateID, productID);
            return Ok(data);
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllAsync()
        {
            var data = await _productService.GetAllAsync();
            return Ok(data);
        }

        [HttpGet("productID")]
        public async Task<IActionResult> GetListProductByProductCateID(string productCateID)
        {
            var data = await _productService.GetListProductByProductCateID(productCateID);
            return Ok(data);
        }

        [HttpGet("pagination")]
        public async Task<IActionResult> GetProductWithPaginations([FromQuery] PaginationParams param, string text)
        {
            var data = await _productService.GetProductWithPaginations(param, text);
            return Ok(data);
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchProductWithPaginations([FromQuery] PaginationParams param, string productCateID, string productName)
        {
            var data = await _productService.SearchProductWithPaginations(param, productCateID, productName);
            return Ok(data);
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromForm] Product_Dto model)
        {
            if (model.Content == "null")
            {
                model.Content = null;
            }
            if (model.FileImages == "null")
            {
                model.FileImages = "";
            }
            if (model.FileVideos == "null")
            {
                model.FileVideos = "";
            }

            // Delete images, videos old
            var images = _productRepository.FindAll(x => x.Product_Cate_ID == model.Product_Cate_ID &&
                                                    x.Product_ID == model.Product_ID &&
                                                    x.Product_Name == model.Product_Name).Select(x => x.FileImages).Distinct().FirstOrDefault();

            var videos = _productRepository.FindAll(x => x.Product_Cate_ID == model.Product_Cate_ID &&
                                                    x.Product_ID == model.Product_ID &&
                                                    x.Product_Name == model.Product_Name).Select(x => x.FileVideos).Distinct().FirstOrDefault();
            if (!string.IsNullOrEmpty(images))
            {
                string[] listResult = images.Split(";");
                foreach (var item in listResult)
                {
                    if (item != "")
                    {
                        string folder = _webHostEnvironment.WebRootPath + "\\uploaded\\images";
                        string filePath = Path.Combine(folder, item);

                        // kiểm tra file cũ có không, nếu có thì xóa đi
                        if (System.IO.File.Exists(filePath))
                        {
                            System.IO.File.Delete(filePath);
                        }
                    }
                }
            }
            if (!string.IsNullOrEmpty(videos))
            {
                string[] listResult = videos.Split(";");
                foreach (var item in listResult)
                {
                    if (item != "")
                    {
                        string folder = _webHostEnvironment.WebRootPath + "\\uploaded\\video";
                        string filePath = Path.Combine(folder, item);

                        // kiểm tra file cũ có không, nếu có thì xóa đi
                        if (System.IO.File.Exists(filePath))
                        {
                            System.IO.File.Delete(filePath);
                        }
                    }
                }
            }

            // Add images, videos

            model.FileImages = null;
            if (model.Images != null)
            {
                foreach (var item in model.Images)
                {
                    var filename = ContentDispositionHeaderValue.Parse(item.ContentDisposition).FileName.Trim('"');
                    var randomGiud = Guid.NewGuid().ToString();

                    var check = Path.GetExtension(filename);
                    var uploadPicture = model.Product_Cate_ID + "_" + model.Product_Name + "_" + randomGiud + check;
                    string folder = _webHostEnvironment.WebRootPath + "\\uploaded\\images";

                    if (!Directory.Exists(folder))
                    {
                        Directory.CreateDirectory(folder);
                    }
                    string filePath = Path.Combine(folder, uploadPicture);

                    using (FileStream fs = System.IO.File.Create(filePath))
                    {
                        item.CopyTo(fs);
                        fs.Flush();
                    }
                    model.FileImages += uploadPicture + ";";
                }
            }

            model.FileVideos = null;
            if (model.Videos != null)
            {
                foreach (var item in model.Videos)
                {
                    var filename = ContentDispositionHeaderValue.Parse(item.ContentDisposition).FileName.Trim('"');
                    var randomGiud = Guid.NewGuid().ToString();

                    var check = Path.GetExtension(filename);
                    var uploadVideo = model.Product_Cate_ID + "_" + model.Product_Name + "_" + randomGiud + check;
                    string folder = _webHostEnvironment.WebRootPath + "\\uploaded\\video";

                    if (!Directory.Exists(folder))
                    {
                        Directory.CreateDirectory(folder);
                    }
                    string filePath = Path.Combine(folder, uploadVideo);

                    using (FileStream fs = System.IO.File.Create(filePath))
                    {
                        item.CopyTo(fs);
                        fs.Flush();
                    }
                    model.FileVideos += uploadVideo + ";";
                }
            }
            model.Update_By = User.FindFirst(ClaimTypes.Name).Value;
            model.Update_Time = DateTime.Now;
            var data = await _productService.Update(model);
            return Ok(data);
        }

        [HttpPut("changeNew")]
        public async Task<IActionResult> ChangeNew(Product_Dto model)
        {
            model.Update_By = User.FindFirst(ClaimTypes.Name).Value;
            model.Update_Time = DateTime.Now;
            model.New = !model.New;
            var data = await _productService.Update(model);
            return Ok(data);
        }

        [HttpPut("changeHotSale")]
        public async Task<IActionResult> ChangeHotSale(Product_Dto model)
        {
            model.Update_By = User.FindFirst(ClaimTypes.Name).Value;
            model.Update_Time = DateTime.Now;
            model.Hot_Sale = !model.Hot_Sale;
            var data = await _productService.Update(model);
            return Ok(data);
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
            var data = await _productService.Update(model);
            return Ok(data);
        }

        [HttpPut("changeStatus")]
        public async Task<IActionResult> ChangeStatus(Product_Dto model)
        {
            model.Update_By = User.FindFirst(ClaimTypes.Name).Value;
            model.Update_Time = DateTime.Now;
            model.Status = !model.Status;
            var data = await _productService.Update(model);
            return Ok(data);
        }

        [HttpDelete]
        public async Task<IActionResult> Remove(string productCateID, int productID)
        {
            var data = await _productService.Remove(productCateID, productID);
            return Ok(data);
        }
    }
}