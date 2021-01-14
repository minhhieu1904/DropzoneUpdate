using System.Threading.Tasks;
using API.Dtos;

namespace API._Services.Interface
{
    public interface IAuthService
    {
        Task<User_Logged_Dto> Login(string username, string password);
    }
}