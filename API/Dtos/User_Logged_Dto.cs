using System;
using System.Collections.Generic;

namespace API.Dtos
{
    public class User_Logged_Dto
    {
        public string Factory_ID { get; set; }
        public string User_Account { get; set; }
        public string User_Name { get; set; }
        public string Email { get; set; }
        public List<string> Role { get; set; }
    }
}