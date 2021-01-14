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
    public class ProductCategoryService : IProductCategoryService
    {
        private readonly IProductCategoryRepository _productCategoryRepository;
        private readonly IMapper _mapper;
        private readonly MapperConfiguration _configuration;
        private OperationResult operationResult;

        public ProductCategoryService(
            IProductCategoryRepository productCategoryRepository,
            IMapper mapper,
            MapperConfiguration configuration)
        {
            _productCategoryRepository = productCategoryRepository;
            _mapper = mapper;
            _configuration = configuration;
        }

        public async Task<OperationResult> Create(ProductCategory_Dto model)
        {
            model.Product_Cate_ID = await GetProductCategoryID();
            var data = _mapper.Map<ProductCategory>(model);
            try
            {
                _productCategoryRepository.Add(data);
                await _productCategoryRepository.Save();
                operationResult = new OperationResult { Success = true, Message = "Product Category was successfully added." };
            }
            catch (System.Exception)
            {
                operationResult = new OperationResult { Success = false, Message = "Product Category was exists." };
            }
            return operationResult;
        }

        public async Task<ProductCategory_Dto> GetProductCategoryByID(string productCateID)
        {
            return await _productCategoryRepository.FindAll(x => x.Product_Cate_ID == productCateID)
            .ProjectTo<ProductCategory_Dto>(_configuration).FirstOrDefaultAsync();
        }

        public async Task<List<ProductCategory_Dto>> GetAllAsync()
        {
            return await _productCategoryRepository.FindAll().ProjectTo<ProductCategory_Dto>(_configuration).ToListAsync();
        }

        public async Task<PageListUtility<ProductCategory_Dto>> GetProductCategoryWithPaginations(PaginationParams param, string text)
        {
            var data = _productCategoryRepository.FindAll().ProjectTo<ProductCategory_Dto>(_configuration).OrderByDescending(x => x.Update_Time);
            if (text != null)
            {
                data = data.Where(x => x.Product_Cate_Name.ToLower().Contains(text.ToLower())
                || x.Update_By.ToLower().Contains(text.ToLower())
                || x.Product_Cate_ID.ToLower().Contains(text.ToLower())).OrderByDescending(x => x.Update_Time);
            }
            return await PageListUtility<ProductCategory_Dto>.PageListAsync(data, param.PageNumber, param.PageSize);
        }

        public async Task<OperationResult> Update(ProductCategory_Dto model)
        {
            var data = _mapper.Map<ProductCategory>(model);
            try
            {
                _productCategoryRepository.Update(data);
                await _productCategoryRepository.Save();
                operationResult = new OperationResult { Success = true, Message = "Product Category was successfully updated." };
            }
            catch (System.Exception)
            {
                operationResult = new OperationResult { Success = false, Message = "Product Category was failes updated." };
            }

            return operationResult;
        }

        public async Task<OperationResult> Remove(string productCateID)
        {
            var item = await GetProductCategoryByID(productCateID);
            if (item != null)
            {
                try
                {
                    _productCategoryRepository.Remove(item);
                    await _productCategoryRepository.Save();
                    operationResult = new OperationResult { Success = true, Message = "Product Category was delete successfully." };
                }
                catch (System.Exception)
                {
                    operationResult = new OperationResult { Success = false, Message = "Product Category was delete failes." };
                }
            }
            else
            {
                operationResult = new OperationResult { Success = false, Message = "Product Category was delete failes." };
            }

            return operationResult;
        }

        public async Task<string> GetProductCategoryID()
        {
            string productCateID = "Product";
            var items = await _productCategoryRepository.FindAll(x => x.Product_Cate_ID.Contains(productCateID))
                .OrderByDescending(x => x.Product_Cate_ID).FirstOrDefaultAsync();
            if (items != null)
            {
                var serinumber = items.Product_Cate_ID.Substring(8).ToInt();
                var tmp = (serinumber >= 999) ? (serinumber + 1).ToString() :
                    (serinumber >= 99) ? ("0" + (serinumber + 1)) :
                        (serinumber < 9) ? ("000" + (serinumber + 1)) : ("00" + (serinumber + 1));
                productCateID = "Product" + tmp;
            }
            else
            {
                productCateID = "Product0001";
            }
            return productCateID;
        }

        public async Task<object> GetIDAndName()
        {
            var data = await _productCategoryRepository.FindAll()
            .Select(x => new { Id = x.Product_Cate_ID, Name = x.Product_Cate_ID + "_" + x.Product_Cate_Name}).ToListAsync();
            return data;
        }
    }
}