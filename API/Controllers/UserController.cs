using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API._Repositories.Interfaces;
using API._Services.Interface;
using API._Services.Interfaces;
using API.Dtos;
using API.Helpers.Params;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class UserController : ApiController
    {
        private readonly IUserService _userService;
        private readonly IMapper _mapper;
        private readonly IUserRepository _userRepository;
        private readonly IDropzoneService _dropzoneService;
        public UserController(
            IUserService userService,
            IMapper mapper,
            IUserRepository userRepository,
            IDropzoneService dropzoneService)
        {
            _mapper = mapper;
            _userService = userService;
            _userRepository = userRepository;
            _dropzoneService = dropzoneService;
        }

        [HttpGet("Get")]
        public async Task<IActionResult> GetUser([FromQuery] string factory_ID, string user_Account)
        {
            var user = await _userService.GetUser(factory_ID, user_Account);
            if (user == null)
                return NotFound("User not found.");

            return Ok(user);
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetUsers([FromQuery] PaginationParams param)
        {
            var users = await _userService.GetUserWithPaginations(param);
            return Ok(users);
        }

        [HttpGet("Search/{text}")]
        public async Task<IActionResult> SearchUsers([FromQuery] PaginationParams param, string text)
        {
            var users = await _userService.Search(param, text);
            return Ok(users);
        }

        [HttpGet("GetRoles")]
        public async Task<IActionResult> GetRolesByUser([FromQuery] string factory_ID, string user_Account)
        {
            var roles = await _userService.GetRoleByUser(factory_ID, user_Account);
            return Ok(roles);
        }

        [HttpPost("Create")]
        public async Task<IActionResult> CreateUser([FromForm] User_Dto model)
        {
            if (model.File != null)
                model.Image = await _dropzoneService.UploadFile(model.File, model.User_Account.Trim() + "_", "\\uploaded\\images\\user");
            model.Update_By = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var result = await _userService.CreateUser(model);
            return Ok(result);
        }

        [HttpPost("SaveRoles")]
        public async Task<IActionResult> SaveRoles(List<Role_User_Authorize_Dto> listRoleUserAuthorize)
        {
            var create_By = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var result = await _userService.SaveRoles(listRoleUserAuthorize, create_By);
            return Ok(result);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateUser([FromForm] User_Dto model)
        {
            if (model.File != null)
            {
                var image = await _userRepository.FindAll(x => x.Factory_ID == model.Factory_ID && x.User_Account == model.User_Account)
                                                             .Select(x => x.Image)
                                                             .FirstOrDefaultAsync();
                if (!string.IsNullOrEmpty(image))
                    _dropzoneService.DeleteFileUpload(image, "\\uploaded\\images\\user");
                model.Image = await _dropzoneService.UploadFile(model.File, model.User_Account.Trim() + "_", "\\uploaded\\images\\user");
            }
            model.Update_By = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var result = await _userService.UpdateUser(model);
            return Ok(result);
        }

        [HttpGet("UpdateLastLogin")]
        public async Task<IActionResult> UpdateLastLogin(string factory_ID, string user_Account)
        {
            if (!await _userService.IsUserExists(factory_ID, user_Account))
                return BadRequest("User not found");

            if (await _userService.UpdateLastLogin(factory_ID, user_Account))
                return NoContent();

            return BadRequest("Updating last login failed on save");
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteUser(string factory_ID, string user_Account)
        {
            var image = await _userRepository.FindAll(x => x.Factory_ID == factory_ID && x.User_Account == user_Account)
                                             .Select(x => x.Image)
                                             .FirstOrDefaultAsync();
            if (!string.IsNullOrEmpty(image))
                _dropzoneService.DeleteFileUpload(image, "\\uploaded\\images\\user");
            var result = await _userService.DeleteUser(factory_ID, user_Account);
            return Ok(result);
        }
    }
}