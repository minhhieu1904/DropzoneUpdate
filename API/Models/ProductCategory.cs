using System;
using System.ComponentModel.DataAnnotations;

namespace API.Models
{
    public class ProductCategory
    {
        [Key]
        public string Product_Cate_ID { get; set; }
        public string Product_Cate_Name { get; set; }
        public bool Status { get; set; }
        public int Position { get; set; }
        public string Update_By { get; set; }
        public DateTime Update_Time { get; set; }
    }
}