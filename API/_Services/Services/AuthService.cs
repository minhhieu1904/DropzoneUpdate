using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using API._Repositories.Interfaces;
using API._Services.Interface;
using API.Dtos;

namespace API._Services.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _UserRepository;
        private readonly IMapper _mapper;
        private readonly MapperConfiguration _mapperConfiguration;
        private readonly IRoleUserRepository _roleUserRepository;
        private readonly IRolesRepository _rolesRepository;
        private readonly IConfiguration _configuration;

        public AuthService(IUserRepository UserRepository, IMapper mapper, IRolesRepository rolesRepository,
            MapperConfiguration mapperConfiguration, IRoleUserRepository roleUserRepository,
            IConfiguration configuration)
        {
            _configuration = configuration;
            _rolesRepository = rolesRepository;
            _UserRepository = UserRepository;
            _mapper = mapper;
            _mapperConfiguration = mapperConfiguration;
            _roleUserRepository = roleUserRepository;
        }

        public async Task<User_Logged_Dto> Login(string username, string password)
        {
            // Authorize user
            var user = await _UserRepository
                .FindAll(x => x.User_Account.Trim() == username.Trim() && x.Password.Trim() == password)
                .ProjectTo<User_Dto>(_mapperConfiguration)
                .FirstOrDefaultAsync();

            if (user == null)
                return null;

            // Get user roles
            var userRoles = await _roleUserRepository.FindAll(r => r.user_account == username).Select(r => r.role_unique).ToListAsync();
            var userToReturn = new User_Logged_Dto
            {
                Email = user.Email,
                Factory_ID = user.Factory_ID,
                User_Account = user.User_Account,
                User_Name = user.User_Name,
                Role = userRoles
            };

            return userToReturn;
        }
    }
}