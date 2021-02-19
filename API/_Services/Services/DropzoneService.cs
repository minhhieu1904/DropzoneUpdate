using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using API._Services.Interfaces;
using API.Dtos;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace API._Services.Services
{
    public class DropzoneService : IDropzoneService
    {
        private readonly IWebHostEnvironment _webHostEnvironment;

        public DropzoneService(IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
        }

        public void DeleteFileUpload(string files, string fileFolder)
        {
            string[] listResult = files.Split(";");
            foreach (var item in listResult)
            {
                if (item != "")
                {
                    string folder = _webHostEnvironment.WebRootPath + fileFolder;
                    string filePath = Path.Combine(folder, item);

                    // kiểm tra file cũ có không, nếu có thì xóa đi
                    if (System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath);
                    }
                }
            }
        }

        public async Task<string> UploadFile(List<IFormFile> files, string name, string fileFolder)
        {
            string fileUploads = "";

            if (files != null)
            {
                foreach (var item in files)
                {
                    var filename = ContentDispositionHeaderValue.Parse(item.ContentDisposition).FileName.Trim('"');
                    var randomGiud = Guid.NewGuid().ToString();

                    var check = Path.GetExtension(filename);
                    var uploadPicture = name + randomGiud + check;
                    string folder = _webHostEnvironment.WebRootPath + fileFolder;

                    if (!Directory.Exists(folder))
                    {
                        Directory.CreateDirectory(folder);
                    }
                    string filePath = Path.Combine(folder, uploadPicture);

                    using (FileStream fs = System.IO.File.Create(filePath))
                    {
                        item.CopyTo(fs);
                        fs.Flush();
                    }
                    fileUploads += uploadPicture + ";";
                }
            }
            return await Task.FromResult(fileUploads);
        }
    }
}