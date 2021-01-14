using API._Repositories.Interfaces;
using API.Data;
using API.Models;

namespace API._Repositories.Repositories
{
    public class UploadFileRepository : Repository<FileUpload>, IUploadFileRepository
    {
        public UploadFileRepository(DBContext context) : base(context)
        {
        }
    }
}