using System;

namespace API.Dtos
{
    public class User_Dto
    {
        public string Factory_ID { get; set; }
        public string User_Account { get; set; }
        public string Password { get; set; }
        public string User_Name { get; set; }
        public string Email { get; set; }
        public DateTime? Valid_From { get; set; }
        public DateTime? Valid_To { get; set; }
        public DateTime? Last_Login { get; set; }
        public string Update_By { get; set; }
        public DateTime? Update_Time { get; set; }
    }
}