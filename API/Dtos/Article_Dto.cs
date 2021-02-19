using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;

namespace API.Dtos
{
    public class Article_Dto
    {
        public int Article_ID { get; set; }
        public string Article_Name { get; set; }
        public string Content { get; set; }
        public string Link { get; set; }
        public string Alias { get; set; }
        public bool Status { get; set; }
        public string Update_By { get; set; }
        public DateTime Update_Time { get; set; }
        public string Article_Cate_ID { get; set; }
        public string FileImages { get; set; }
        public string FileVideos { get; set; }
        public List<IFormFile> Images { get; set; }
        public List<IFormFile> Videos { get; set; }
    }
}