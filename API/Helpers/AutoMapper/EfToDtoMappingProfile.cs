using AutoMapper;
using API.Dtos;
using API.Models;

namespace API.Helpers.AutoMapper
{
    public class EfToDtoMappingProfile : Profile
    {
        public EfToDtoMappingProfile()
        {
            CreateMap<User, User_Dto>();
            CreateMap<User, User_Detail_Dto>();
            CreateMap<Article, Article_Dto>();
            CreateMap<ArticleCategory, ArticleCategory_Dto>();
            CreateMap<Product, Product_Dto>();
            CreateMap<ProductCategory, ProductCategory_Dto>();
            CreateMap<FileUpload, FileUpload_Dto>();
        }
    }
}