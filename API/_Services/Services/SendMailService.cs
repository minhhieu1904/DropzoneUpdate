using System;
using System.IO;
using System.Threading.Tasks;
using API._Services.Interfaces;
using API.Dtos;
using API.Helpers.Utilities;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;

namespace API._Services.Services
{
    public class SendMailService : ISendMailService
    {
        private readonly MailSetting_Dto _mailSettings;
        private OperationResult operationResult;

        public SendMailService(IOptions<MailSetting_Dto> mailSettings)
        {
            _mailSettings = mailSettings.Value;
        }

        public async Task SendEmailAsync(string email, string subject, string htmlMessage)
        {
            await SendMail(new MailContent()
            {
                To = email,
                Subject = subject,
                Body = htmlMessage
            });
        }

        public async Task<OperationResult> SendMail(MailContent mailContent)
        {
            var email = new MimeMessage();
            email.Sender = new MailboxAddress(_mailSettings.DisplayName, _mailSettings.Mail);
            email.From.Add(new MailboxAddress(_mailSettings.DisplayName, _mailSettings.Mail));
            email.To.Add(MailboxAddress.Parse(mailContent.To));
            email.Subject = mailContent.Subject;


            var builder = new BodyBuilder();
            builder.HtmlBody = mailContent.Body;
            email.Body = builder.ToMessageBody();

            // dùng SmtpClient của MailKit
            using var smtp = new MailKit.Net.Smtp.SmtpClient();

            try
            {
                smtp.Connect(_mailSettings.Host, _mailSettings.Port, SecureSocketOptions.StartTls);
                smtp.Authenticate(_mailSettings.Mail, _mailSettings.Password);
                await smtp.SendAsync(email);

                operationResult = new OperationResult { Success = true, Message = "Send mail to '" + mailContent.To + "' was successfuly." };
            }
            catch (Exception ex)
            {
                // Gửi mail thất bại, nội dung email sẽ lưu vào thư mục mailsave
                if (!Directory.Exists("mailsave"))
                {
                    Directory.CreateDirectory("mailsave");
                }
                var emailsavefile = string.Format(@"mailsave/maillog_{0}.eml", Guid.NewGuid());
                await email.WriteToAsync(emailsavefile);

                operationResult = new OperationResult { Success = false, Message = ex.Message };
            }

            smtp.Disconnect(true);

            return operationResult;
        }
    }
}