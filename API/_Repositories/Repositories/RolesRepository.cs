using API._Repositories.Repositories;
using API.Data;
using API.Models;
using API._Repositories.Interfaces;

namespace API._Repositories.Repositories
{
    public class RolesRepository : Repository<Roles>, IRolesRepository
    {
        public RolesRepository(DBContext context) : base(context)
        {
        }
    }
}