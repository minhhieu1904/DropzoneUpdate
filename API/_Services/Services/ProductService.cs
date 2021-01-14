using System.Collections.Generic;
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

namespace API._Services.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;
        private readonly IProductCategoryRepository _productCategoryRepository;
        private readonly IMapper _mapper;
        private readonly MapperConfiguration _configuration;
        private OperationResult operationResult;

        public ProductService(
            IProductRepository productRepository,
            IMapper mapper,
            MapperConfiguration configuration, 
            IProductCategoryRepository productCategoryRepository)
        {
            _productRepository = productRepository;
            _mapper = mapper;
            _configuration = configuration;
            _productCategoryRepository = productCategoryRepository;
        }

        public async Task<OperationResult> Create(Product_Dto model)
        {
            var item = await GetProductByID(model.Product_Cate_ID, model.Product_ID);
            var data = _mapper.Map<Product>(model);
            try
            {
                if (item == null)
                {
                    _productRepository.Add(data);
                    await _productRepository.Save();
                    operationResult = new OperationResult { Success = true, Message = "Product was successfully added." };
                }
                else
                {
                    operationResult = new OperationResult { Success = false, Message = "Product was exists." };
                }
            }
            catch (System.Exception ex)
            {
                operationResult = new OperationResult { Success = false, Message = ex.ToString() };
            }
            return operationResult;
        }

        public async Task<Product_Dto> GetProductByID(string productCateID, int productID)
        {
            return await _productRepository.FindAll(x => x.Product_Cate_ID == productCateID && x.Product_ID == productID)
            .ProjectTo<Product_Dto>(_configuration).FirstOrDefaultAsync();
        }

        public async Task<List<Product_Dto>> GetAllAsync()
        {
            return await _productRepository.FindAll().ProjectTo<Product_Dto>(_configuration).ToListAsync();
        }

        public async Task<PageListUtility<Product_Dto>> GetProductWithPaginations(PaginationParams param, string text)
        {
            var data = _productRepository.FindAll().ProjectTo<Product_Dto>(_configuration).OrderByDescending(x => x.Product_Cate_ID).ThenBy(x => x.Product_ID);
            if (!string.IsNullOrEmpty(text))
            {
                data = data.Where(x => x.Product_ID.ToString().ToLower().Contains(text.ToLower())
                || x.Product_Name.ToLower().Contains(text.ToLower())
                || x.Update_By.ToLower().Contains(text.ToLower())
                || x.Product_Cate_ID.ToLower().Contains(text.ToLower())
                ).OrderByDescending(x => x.Product_Cate_ID).ThenBy(x => x.Product_ID);
            }
            return await PageListUtility<Product_Dto>.PageListAsync(data, param.PageNumber, param.PageSize);
        }

        public async Task<OperationResult> Update(Product_Dto model)
        {
            var data = _mapper.Map<Product>(model);
            try
            {
                _productRepository.Update(data);
                await _productRepository.Save();
                operationResult = new OperationResult { Success = true, Message = "Product was successfully updated." };
            }
            catch (System.Exception ex)
            {
                operationResult = new OperationResult { Success = false, Message = ex.ToString() };
            }
            return operationResult;
        }

        public async Task<OperationResult> Remove(string productCateID, int productID)
        {
            var item = await GetProductByID(productCateID, productID);
            try
            {
                if (item != null)
                {
                    _productRepository.Remove(item);
                    await _productRepository.Save();
                    operationResult = new OperationResult { Success = true, Message = "Product was delete successfully." };
                }
                else
                {
                    operationResult = new OperationResult { Success = false, Message = "Product was delete failse." };
                }
            }
            catch (System.Exception ex)
            {
                operationResult = new OperationResult { Success = false, Message = ex.ToString() };
            }
            return operationResult;
        }

        public async Task<PageListUtility<Product_Dto>> SearchProductWithPaginations(PaginationParams param, string productCateID, string productName)
        {
            var productCateList = _productCategoryRepository.FindAll();
            var productList = _productRepository.FindAll();
            if(!string.IsNullOrEmpty(productCateID)){
                productCateList = productCateList.Where(x => x.Product_Cate_ID == productCateID);
            }
            if(!string.IsNullOrEmpty(productName)){
                productList = productList.Where(x => x.Product_Name == productName);
            }

            var query = productCateList.Join(
                        productList,
                        x => x.Product_Cate_ID,
                        y => y.Product_Cate_ID,
                        (x, y) => new Product_Dto {
                            Amount = y.Amount,
                            Content = y.Content,
                            Discount = y.Discount,
                            From_Date_Sale = y.From_Date_Sale,
                            Hot_Sale = y.Hot_Sale,
                            IsSale = y.IsSale,
                            New = y.New,
                            Price = y.Price,
                            Price_Sale = y.Price_Sale,
                            Product_Cate_ID = y.Product_Cate_ID,
                            Product_ID = y.Product_ID,
                            Product_Name = y.Product_Name,
                            Status =y.Status,
                            Time_Sale = y.Time_Sale,
                            To_Date_Sale = y.To_Date_Sale,
                            Update_By = y.Update_By,
                            Update_Time = y.Update_Time,
                            FileImages = y.FileImages,
                            FileVideos = y.FileVideos
                        }).OrderByDescending(x => x.Product_Cate_ID).ThenBy(x => x.Product_ID);
            return await PageListUtility<Product_Dto>.PageListAsync(query, param.PageNumber, param.PageSize);
        }

        public async Task<object> GetListProductByProductCateID(string productCateID)
        {
            var data = await _productRepository.FindAll(x => x.Product_Cate_ID == productCateID)
            .Select(x => new { Id = x.Product_Name, Name = x.Product_ID + "_" + x.Product_Name}).ToListAsync();
            return data;
        }
    }
}