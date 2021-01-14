using System.Collections.Generic;
using System.Threading.Tasks;
using API.Dtos;
using API.Helpers.Params;
using API.Helpers.Utilities;

namespace API._Services.Interface
{
    public interface IUserService
    {
        Task<OperationResult> CreateUser(User_Dto model);
        Task<OperationResult> UpdateUser(User_Dto model);
        Task<OperationResult> DeleteUser(string factory_ID, string user_Account);
        Task<User_Dto> GetUser(string factory_ID, string user_Account);
        Task<bool> IsUserExists(string factory_ID, string user_Account);
        Task<PageListUtility<User_Detail_Dto>> GetUserWithPaginations(PaginationParams param);
        Task<PageListUtility<User_Detail_Dto>> Search(PaginationParams param, string text);
        Task<List<Role_User_Authorize_Dto>> GetRoleByUser(string factory_ID, string user_Account);
        Task<OperationResult> SaveRoles(List<Role_User_Authorize_Dto> listRoleUser, string create_By);
        Task<bool> UpdateLastLogin(string factory_ID, string user_Account);
    }
}