using System;
using System.Security.Claims;
using System.Threading.Tasks;
using API._Services.Interfaces;
using API.Dtos;
using API.Helpers.Params;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProductCategoryController : ApiController
    {
        private readonly IProductCategoryService _productCategoryService;

        public ProductCategoryController(IProductCategoryService productCategoryService)
        {
            _productCategoryService = productCategoryService;
        }

        [HttpPost]
        public async Task<IActionResult> Create(ProductCategory_Dto model)
        {
            model.Update_By = User.FindFirst(ClaimTypes.Name).Value;
            model.Update_Time = DateTime.Now;
            var data = await _productCategoryService.Create(model);
            return Ok(data);
        }

        [HttpGet]
        public async Task<IActionResult> GetProductCategoryByID(string productCateID){
            var data = await _productCategoryService.GetProductCategoryByID(productCateID);
            return Ok(data);
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllAsync(){
            var data = await _productCategoryService.GetAllAsync();
            return Ok(data);
        }

        [HttpGet("name")]
        public async Task<IActionResult> GetIDAndName()
        {
            var data = await _productCategoryService.GetIDAndName();
            return Ok(data);
        }

        [HttpGet("pagination")]
        public async Task<IActionResult> GetProductCategoryWithPaginations([FromQuery] PaginationParams param, string text)
        {
            var data = await _productCategoryService.GetProductCategoryWithPaginations(param, text);
            return Ok(data);
        }

        [HttpPut]
        public async Task<IActionResult> Update(ProductCategory_Dto model)
        {
            model.Update_By = User.FindFirst(ClaimTypes.Name).Value;
            model.Update_Time = DateTime.Now;
            var data = await _productCategoryService.Update(model);
            return Ok(data);
        }

        [HttpPut("changeStatus")]
        public async Task<IActionResult> ChangeStatus(ProductCategory_Dto model)
        {
            model.Update_By = User.FindFirst(ClaimTypes.Name).Value;
            model.Update_Time = DateTime.Now;
            model.Status = !model.Status;
            var data = await _productCategoryService.Update(model);
            return Ok(data);
        }

        [HttpDelete]
        public async Task<IActionResult> Remove(string productCateID)
        {
            var data = await _productCategoryService.Remove(productCateID);
            return Ok(data);
        }
    }
}