using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;

namespace API.Dtos
{
    public class Product_Dto
    {
        public int Product_ID { get; set; }
        public string Product_Name { get; set; }
        public int Time_Sale { get; set; }
        public string Content { get; set; }
        public int Price { get; set; }
        public int Amount { get; set; }
        public bool IsSale { get; set; }
        public int Discount { get; set; }
        public string Price_Sale { get; set; }
        public DateTime? From_Date_Sale { get; set; }
        public DateTime? To_Date_Sale { get; set; }
        public bool New { get; set; }
        public bool Hot_Sale { get; set; }
        public bool Status { get; set; }
        public string FileImages { get; set; }
        public string FileVideos { get; set; }
        public string Update_By { get; set; }
        public DateTime Update_Time { get; set; }
        public string Product_Cate_ID { get; set; }
        public List<IFormFile> Images { get; set; }
        public List<IFormFile> Videos { get; set; }
    }
}