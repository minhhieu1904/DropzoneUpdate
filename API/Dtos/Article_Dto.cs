using System;

namespace API.Dtos
{
    public class Article_Dto
    {
        public int Article_ID { get; set; }
        public string Article_Name { get; set; }
        public string Content { get; set; }
        public string Files { get; set; }
        public string Link { get; set; }
        public string Alias { get; set; }
        public bool Status { get; set; }
        public string Update_By { get; set; }
        public DateTime Update_Time { get; set; }
        public string Article_Cate_ID { get; set; }
    }
}