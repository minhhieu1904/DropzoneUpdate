using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public partial class DBContext : DbContext
    {
        public DBContext()
        {
        }

        public DBContext(DbContextOptions<DBContext> options) : base(options)
        {
        }

        public virtual DbSet<User> User { get; set; }
        public virtual DbSet<Roles> Roles { get; set; }
        public virtual DbSet<RoleUser> RoleUser { get; set; }
        public virtual DbSet<ArticleCategory> ArticleCategory { get; set; }
        public virtual DbSet<Article> Article { get; set; }
        public virtual DbSet<ProductCategory> ProductCategory { get; set; }
        public virtual DbSet<Product> Product { get; set; }
        public virtual DbSet<FileUpload> FileUpload { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(entity => { entity.HasKey(e => new { e.User_Account }); });

            modelBuilder.Entity<Roles>(entity => { entity.HasKey(e => e.role_unique); });

            modelBuilder.Entity<RoleUser>(entity => { entity.HasKey(e => new { e.user_account, e.role_unique }); });

            modelBuilder.Entity<ArticleCategory>(entity => { entity.HasKey(e => new { e.Article_Cate_ID }); });

            modelBuilder.Entity<Article>(entity => { entity.HasKey(e => new { e.Article_ID }); });

            modelBuilder.Entity<ProductCategory>(entity => { entity.HasKey(e => new { e.Product_Cate_ID }); });

            modelBuilder.Entity<Product>(entity => { entity.HasKey(e => new { e.Product_ID }); });

            modelBuilder.Entity<FileUpload>(entity => { entity.HasKey(e => new { e.ID }); });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}