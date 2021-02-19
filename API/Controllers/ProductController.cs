using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API._Repositories.Interfaces;
using API._Services.Interfaces;
using API.Dtos;
using API.Helpers.Params;
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

        [HttpPost("uploadFile")]
        public async Task<IActionResult> Create([FromForm] Product_Dto model)
        {
            model.FileImages = await _dropzoneService.UploadFile(model.Images, model.Product_Cate_ID + "_" + model.Product_Name + "_", "\\uploaded\\images");
            model.FileVideos = await _dropzoneService.UploadFile(model.Videos, model.Product_Cate_ID + "_" + model.Product_Name + "_", "\\uploaded\\video");
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
            var images = await _productRepository.FindAll(x => x.Product_Cate_ID == model.Product_Cate_ID &&
                                                    x.Product_ID == model.Product_ID &&
                                                    x.Product_Name == model.Product_Name).Select(x => x.FileImages).Distinct().FirstOrDefaultAsync();

            var videos = await _productRepository.FindAll(x => x.Product_Cate_ID == model.Product_Cate_ID &&
                                                    x.Product_ID == model.Product_ID &&
                                                    x.Product_Name == model.Product_Name).Select(x => x.FileVideos).Distinct().FirstOrDefaultAsync();
            if (!string.IsNullOrEmpty(images))
            {
                _dropzoneService.DeleteFileUpload(images, "\\uploaded\\images");
            }
            if (!string.IsNullOrEmpty(videos))
            {
                _dropzoneService.DeleteFileUpload(videos, "\\uploaded\\video");
            }

            // Add images, videos
            model.FileImages = null;
            model.FileVideos = null;

            model.FileImages = await _dropzoneService.UploadFile(model.Images, model.Product_Cate_ID + "_" + model.Product_Name + "_", "\\uploaded\\images");
            model.FileVideos = await _dropzoneService.UploadFile(model.Videos, model.Product_Cate_ID + "_" + model.Product_Name + "_", "\\uploaded\\video");
            
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

        [HttpPost("delete")]
        public async Task<IActionResult> Remove(Product_Dto model)
        {
            var images = await _productRepository.FindAll(x => x.Product_Cate_ID == model.Product_Cate_ID &&
                                                    x.Product_ID == model.Product_ID &&
                                                    x.Product_Name == model.Product_Name).Select(x => x.FileImages).Distinct().FirstOrDefaultAsync();

            var videos = await _productRepository.FindAll(x => x.Product_Cate_ID == model.Product_Cate_ID &&
                                                    x.Product_ID == model.Product_ID &&
                                                    x.Product_Name == model.Product_Name).Select(x => x.FileVideos).Distinct().FirstOrDefaultAsync();
            if (!string.IsNullOrEmpty(images))
            {
                _dropzoneService.DeleteFileUpload(images, "\\uploaded\\images");
            }
            if (!string.IsNullOrEmpty(videos))
            {
                _dropzoneService.DeleteFileUpload(videos, "\\uploaded\\video");
            }
            var data = await _productService.Remove(model);
            return Ok(data);
        }
    }
}