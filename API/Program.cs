using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            string rootdir = Directory.GetCurrentDirectory();
            try
            {
                Aspose.Cells.License cellLicense = new Aspose.Cells.License();
                string filePath = rootdir + "\\Resources\\" + "Aspose.Total.lic";
                FileStream fileStream = new FileStream(filePath, FileMode.Open);
                cellLicense.SetLicense(fileStream);
            }
            catch (Exception)
            {

                throw;
            }
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
