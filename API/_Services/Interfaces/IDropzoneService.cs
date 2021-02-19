using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace API._Services.Interfaces
{
    public interface IDropzoneService
    {
        Task<string> UploadFile(List<IFormFile> files, string name, string fileFolder);
        void DeleteFileUpload(string files, string fileFolder);
    }
}