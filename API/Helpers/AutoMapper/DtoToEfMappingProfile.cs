using AutoMapper;
using API.Dtos;
using API.Models;

namespace API.Helpers.AutoMapper
{
    public class DtoToEfMappingProfile : Profile
    {
        public DtoToEfMappingProfile()
        {
            CreateMap<User_Dto, User>();
            CreateMap<User_Dto, User_Detail_Dto>();
            CreateMap<Article_Dto, Article>();
            CreateMap<ArticleCategory_Dto, ArticleCategory>();
            CreateMap<Product_Dto, Product>();
            CreateMap<ProductCategory_Dto, ProductCategory>();
            CreateMap<FileUpload_Dto, FileUpload>();
        }
    }
}