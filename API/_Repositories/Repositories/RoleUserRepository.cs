using API._Repositories.Interfaces;
using API.Data;
using API.Models;

namespace API._Repositories.Repositories
{
    public class RoleUserRepository : Repository<RoleUser>, IRoleUserRepository
    {
        public RoleUserRepository(DBContext context) : base(context)
        {
        }
    }
}