using System.Threading.Tasks;
using API.Dtos;
using API.Helpers.Utilities;

namespace API._Services.Interfaces
{
    public interface ISendMailService
    {
        Task<OperationResult> SendMail(MailContent mailContent);
        Task SendEmailAsync(string email, string subject, string htmlMessage);
    }
}