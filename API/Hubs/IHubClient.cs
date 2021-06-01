using System.Threading.Tasks;

namespace API.Hubs
{
    public interface IHubClient
    {
        Task LoadDataArticleCate();
        Task LoadDataArticle();
        Task LoadDataProductCate();
        Task LoadDataProduct();
    }
}