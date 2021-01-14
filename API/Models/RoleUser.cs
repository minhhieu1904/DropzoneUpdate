using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models
{
    public class RoleUser
    {
        [Key]
        [StringLength(50)]
        public string user_account { get; set; }
        [Key]
        [StringLength(50)]
        public string role_unique { get; set; }
        [Required]
        [StringLength(50)]
        public string create_by { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime create_time { get; set; }
    }
}