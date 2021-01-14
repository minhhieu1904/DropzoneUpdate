using System;

namespace API.Dtos
{
    public class FileUpload_Dto
    {
        public int ID { get; set; }
        public string FileName { get; set; }
        public string Update_By { get; set; }
        public DateTime Update_Time { get; set; }
        public bool Status { get; set; }
        public int Product_ID { get; set; }
    }
}