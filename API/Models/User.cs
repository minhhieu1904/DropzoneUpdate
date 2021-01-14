using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models
{/// <summary>
 /// User Profile
 /// </summary>
    public partial class User
    {
        /// <summary>
        /// Factory short name
        /// </summary>
        [Key]
        [StringLength(10)]
        public string Factory_ID { get; set; }
        /// <summary>
        /// User’s AD account
        /// </summary>
        [Key]
        [StringLength(20)]
        public string User_Account { get; set; }
        /// <summary>
        /// Use password
        /// </summary>
        [StringLength(20)]
        public string Password { get; set; }
        /// <summary>
        /// Use name
        /// </summary>
        [StringLength(50)]
        public string User_Name { get; set; }
        /// <summary>
        /// Email address
        /// </summary>
        [StringLength(254)]
        public string Email { get; set; }
        /// <summary>
        /// Account valid from date
        /// </summary>
        [Column(TypeName = "date")]
        public DateTime? Valid_From { get; set; }
        /// <summary>
        /// Account valid to date
        /// </summary>
        [Column(TypeName = "date")]
        public DateTime? Valid_To { get; set; }
        /// <summary>
        /// Last login time
        /// </summary>
        [Column(TypeName = "datetime")]
        public DateTime? Last_Login { get; set; }
        /// <summary>
        /// Updated by user account
        /// </summary>
        [StringLength(50)]
        public string Update_By { get; set; }
        /// <summary>
        /// Updated datetime
        /// </summary>
        [Column(TypeName = "datetime")]
        public DateTime? Update_Time { get; set; }
    }
}