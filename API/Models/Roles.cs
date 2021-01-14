using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models
{
    /// <summary>
    /// Role List
    /// </summary>
    public partial class Roles
    {
        [Key]
        [StringLength(50)]
        public string role_unique { get; set; }
        [Required]
        [StringLength(50)]
        public string role_name { get; set; }
        [Required]
        [StringLength(50)]
        public string role_type { get; set; }
        [Required]
        [StringLength(250)]
        public string role_note { get; set; }
        public double role_sequence { get; set; }
        [Required]
        [StringLength(50)]
        public string update_by { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime update_time { get; set; }
    }
}