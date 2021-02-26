using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using API.Dtos;
using Microsoft.Extensions.Options;

namespace API.Helpers.Utilities
{
    public interface ISendMailByGmail
    {
        Task<OperationResult> SendMail(MailMessage message, SmtpClient client);
        Task<OperationResult> SendMailLocalSmtp(MailContent mailContent);
    }

    public class SendMailByGmail : ISendMailByGmail
    {
        private OperationResult operationResult;
        private readonly MailSetting_Dto _mailSettings;

        public SendMailByGmail(IOptions<MailSetting_Dto> mailSettings)
        {
            _mailSettings = mailSettings.Value;
        }

        public async Task<OperationResult> SendMail(MailMessage message, SmtpClient client)
        {
            try
            {
                await client.SendMailAsync(message);
                operationResult = new OperationResult { Success = true, Message = "Send mail to '" + message.To + "' was successfuly." };
            }
            catch (Exception ex)
            {
                operationResult = new OperationResult { Success = false, Message = ex.Message };
            }
            client.Dispose();
            return operationResult;
        }

        public async Task<OperationResult> SendMailLocalSmtp(MailContent mailContent)
        {
            MailMessage message = new MailMessage(
                from: _mailSettings.Mail,
                to: mailContent.To,
                subject: mailContent.Subject,
                body: mailContent.Body
            );
            message.BodyEncoding = System.Text.Encoding.UTF8;
            message.SubjectEncoding = System.Text.Encoding.UTF8;
            message.IsBodyHtml = true;
            message.ReplyToList.Add(new MailAddress(_mailSettings.Mail, _mailSettings.DisplayName));
            message.Sender = new MailAddress(_mailSettings.Mail, _mailSettings.DisplayName);

            // Tạo SmtpClient kết nối đến smtp.gmail.com
            using (SmtpClient client = new SmtpClient(_mailSettings.Host))
            {
                client.Port = _mailSettings.Port;
                client.Credentials = new NetworkCredential(_mailSettings.Mail, _mailSettings.Password);
                client.EnableSsl = true;
                return await SendMail(message, client);
            }
        }
    }
}