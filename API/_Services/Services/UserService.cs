using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.Extensions.Configuration;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using API._Repositories.Interfaces;
using API._Services.Interface;
using API.Dtos;
using API.Helpers.Params;
using API.Helpers.Utilities;
using API.Models;

namespace API._Services.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IRolesRepository _rolesRepository;
        private readonly IRoleUserRepository _roleUserRepository;
        private readonly IMapper _mapper;
        private readonly MapperConfiguration _mapperConfiguration;
        private readonly IConfiguration _configuration;
        private OperationResult operationResult;
        public UserService(
            IUserRepository userRepository,
            IRolesRepository rolesRepository,
            IRoleUserRepository roleUserRepository,
            IMapper mapper,
            MapperConfiguration mapperConfiguration,
            IConfiguration configuration
        )
        {
            _mapperConfiguration = mapperConfiguration;
            _configuration = configuration;
            _mapper = mapper;
            _userRepository = userRepository;
            _rolesRepository = rolesRepository;
            _roleUserRepository = roleUserRepository;
        }

        public async Task<OperationResult> CreateUser(User_Dto model)
        {
            if (await IsUserExists(model.Factory_ID, model.User_Account))
            {
                operationResult = new OperationResult { Success = false, Message = "User account already exists." };
                return operationResult;
            }

            model.Update_Time = DateTime.Now;
            model.Last_Login = DateTime.Now;
            model.Valid_From = DateTime.Today;
            model.Valid_To = new DateTime(9999, 12, 31);

            var user = _mapper.Map<User>(model);
            _userRepository.Add(user);
            try
            {
                await _userRepository.Save();
                operationResult = new OperationResult { Success = true, Message = "User was successfully added." };
            }
            catch (System.Exception)
            {
                operationResult = new OperationResult { Success = false, Message = "Adding user failed on save." };
            }
            return operationResult;
        }

        public async Task<OperationResult> DeleteUser(string factory_ID, string user_Account)
        {
            if (!await IsUserExists(factory_ID, user_Account))
            {
                operationResult = new OperationResult { Success = false, Message = "User not found." };
                return operationResult;
            }

            // Remove user's roles
            var userRoles = _roleUserRepository.FindAll(r => r.user_account == user_Account).ToList();
            if (userRoles.Count > 0)
            {
                _roleUserRepository.RemoveMultiple(userRoles);
                try
                {
                    await _roleUserRepository.Save();
                }
                catch (System.Exception)
                {
                    operationResult = new OperationResult { Success = false, Message = "Cannot delete user's roles" };
                }

            }

            // Remove user
            var user = await _userRepository.FindSingle(x => x.Factory_ID == factory_ID && x.User_Account == user_Account);
            _userRepository.Remove(user);
            try
            {
                await _userRepository.Save();
                operationResult = new OperationResult { Success = true, Message = "User was successfully deleted." };
            }
            catch (System.Exception)
            {
                operationResult = new OperationResult { Success = false, Message = "Deleting user failed on save." };
            }

            return operationResult;
        }

        public async Task<List<Role_User_Authorize_Dto>> GetRoleByUser(string factory_ID, string user_Account)
        {
            var allRoles = _rolesRepository.FindAll();
            var userRoles = _roleUserRepository.FindAll(r => r.user_account == user_Account);
            var result = await allRoles.Select(r => new Role_User_Authorize_Dto
                                {
                                    Factory_ID = factory_ID,
                                    User_Account = user_Account,
                                    Role_Unique = r.role_unique,
                                    Role_Name = r.role_name,
                                    Role_Type = r.role_type,
                                    Role_Sequence = r.role_sequence,
                                    Status = userRoles == null ? false :
                                                                 userRoles.Where(x => x.user_account == user_Account && x.role_unique == r.role_unique)
                                                                          .Count() != 0 ? true : false
                                }).OrderBy(x => x.Role_Sequence).ToListAsync();

            return result;
        }

        public async Task<User_Dto> GetUser(string factory_ID, string user_Account)
        {
            var user = await _userRepository.FindSingle(x => x.Factory_ID == factory_ID && x.User_Account == user_Account);
            var userToReturn = _mapper.Map<User_Dto>(user);
            return userToReturn;
        }

        public async Task<PageListUtility<User_Detail_Dto>> GetUserWithPaginations(PaginationParams param)
        {
            var usersQuery = _userRepository
                .FindAll()
                .OrderByDescending(x => x.Update_Time)
                .ProjectTo<User_Detail_Dto>(_mapperConfiguration);
            return await PageListUtility<User_Detail_Dto>.PageListAsync(usersQuery, param.PageNumber, param.PageSize);
        }

        public async Task<bool> IsUserExists(string factory_ID, string user_Account)
        {
            var user = await _userRepository.FindSingle(x => x.User_Account == user_Account);
            if (user == null)
                return false;
            return true;
        }

        public async Task<OperationResult> SaveRoles(List<Role_User_Authorize_Dto> listRoleUser, string create_By)
        {
            var user_Account = listRoleUser[0].User_Account;
            var factory_ID = listRoleUser[0].Factory_ID;
            if (!await IsUserExists(factory_ID, user_Account))
            {
                operationResult = new OperationResult { Success = false, Message = "User not found." };
                return operationResult;
            }

            // Remove current roles
            var userCurrentRoles = _roleUserRepository.FindAll(u => u.user_account == user_Account).ToList();
            _roleUserRepository.RemoveMultiple(userCurrentRoles);

            // Filter active roles
            listRoleUser = listRoleUser.FindAll(r => r.Status == true);

            // Create model to save
            var userRoleToSaveList = listRoleUser
                .Select(x => new RoleUser
                {
                    user_account = x.User_Account,
                    role_unique = x.Role_Unique,
                    create_by = create_By,
                    create_time = DateTime.Now
                })
                .ToList();

            // Save model
            _roleUserRepository.AddMultiple(userRoleToSaveList);
            try
            {
                await _roleUserRepository.Save();
            }
            catch (System.Exception)
            {
                operationResult = new OperationResult { Success = false, Message = "Updating user authorization failed on save." };
            }

            // Update User's Update_By & Update_Time
            var user = await _userRepository.FindSingle(x => x.Factory_ID == factory_ID && x.User_Account == user_Account);
            user.Update_By = create_By;
            user.Update_Time = DateTime.Now;
            _userRepository.Update(user);
            try
            {
                await _userRepository.Save();
                operationResult = new OperationResult { Success = true, Message = "User was successfully authorized." };
            }
            catch (System.Exception)
            {
                operationResult = new OperationResult { Success = false, Message = "Updating user authorization failed on save." };
            }

            return operationResult;
        }

        public async Task<PageListUtility<User_Detail_Dto>> Search(PaginationParams param, string text)
        {
            var usersQuery = _userRepository
                .FindAll(x => x.Factory_ID.ToLower().Contains(text.ToLower()) || x.User_Account.ToLower().Contains(text.ToLower()) || x.User_Name.ToLower().Contains(text.ToLower()) || x.Email.ToLower().Contains(text.ToLower()))
                .OrderByDescending(x => x.Update_Time)
                .ProjectTo<User_Detail_Dto>(_mapperConfiguration);
            return await PageListUtility<User_Detail_Dto>.PageListAsync(usersQuery, param.PageNumber, param.PageSize);
        }

        public async Task<OperationResult> UpdateUser(User_Dto model)
        {
            var userToUpdate = await _userRepository
                .FindSingle(x => x.Factory_ID == model.Factory_ID && x.User_Account == model.User_Account);
            if (userToUpdate == null)
            {
                operationResult = new OperationResult { Success = false, Message = "User not found." };
                return operationResult;
            }

            userToUpdate.Factory_ID = model.Factory_ID;
            userToUpdate.User_Account = model.User_Account;
            userToUpdate.User_Name = model.User_Name;
            userToUpdate.Email = model.Email;
            userToUpdate.Update_Time = DateTime.Now;
            userToUpdate.Update_By = model.Update_By;
            if (!string.IsNullOrEmpty(model.Password))
            {
                userToUpdate.Password = model.Password;
            }
            _userRepository.Update(userToUpdate);
            try
            {
                await _userRepository.Save();
                operationResult = new OperationResult { Success = true, Message = "User was successfully updated." };
            }
            catch (System.Exception)
            {
                operationResult = new OperationResult { Success = false, Message = "Updating user failed on save." };
            }

            return operationResult;
        }

        public async Task<bool> UpdateLastLogin(string factory_ID, string user_Account)
        {
            var user = await _userRepository.FindSingle(x => x.Factory_ID == factory_ID && x.User_Account == user_Account);
            user.Last_Login = DateTime.Now;

            return await _userRepository.Save();
        }
    }
}