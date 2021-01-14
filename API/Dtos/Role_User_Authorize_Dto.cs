using System;

namespace API.Dtos
{
    public class Role_User_Authorize_Dto
    {
        public string Factory_ID { get; set; }
        public string User_Account { get; set; }
        public string Role_Unique { get; set; }
        public string Role_Name { get; set; }
        public string Role_Type { get; set; }
        public double Role_Sequence { get; set; }
        public bool Status { get; set; }
    }
}