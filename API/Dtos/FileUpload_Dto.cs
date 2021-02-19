using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;

namespace API.Dtos
{
    public class FileUpload_Dto
    {
        public List<IFormFile> Images { get; set; }
        public List<IFormFile> Videos { get; set; }
    }
}