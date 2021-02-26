using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace API.Helpers.Utilities
{
    public interface IMailUtility
    {
        OperationResult SendMail(string toMail, string subject, string content, string filePath);

        Task<OperationResult> SendMailAsync(string toMail, string subject, string content, string filePath = "");
        Task<OperationResult> SendListMailAsync(List<string> toMail, List<string> ccMail, string subject, string content, string filePath = "");
    }
    public class MailUtility : IMailUtility
    {
        private readonly IConfiguration _configuration;
        private OperationResult operationResult;
        public MailUtility(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public OperationResult SendMail(string toMail, string subject, string content, string filePath)
        {
            MailMessage mail = new MailMessage();
            var test = _configuration.GetSection("MailSettingServer:Server").Value;
            SmtpClient smtpServer = new SmtpClient(_configuration.GetSection("MailSettingServer:Server").Value);
            mail.From = new MailAddress(_configuration.GetSection("MailSettingServer:FromEmail").Value, _configuration.GetSection("MailSettingServer:FromName").Value);

            mail.To.Add(toMail);
            mail.Subject = subject;
            mail.SubjectEncoding = System.Text.Encoding.UTF8;
            mail.Body = content;
            mail.BodyEncoding = System.Text.Encoding.UTF8;

            System.Net.Mail.Attachment attachment;
            attachment = new System.Net.Mail.Attachment(filePath);
            mail.Attachments.Add(attachment);

            smtpServer.Port = Convert.ToInt32(_configuration.GetSection("MailSettingServer:Port").Value);
            smtpServer.Credentials = new NetworkCredential(_configuration.GetSection("MailSettingServer:UserName").Value, _configuration.GetSection("MailSettingServer:Password").Value);
            smtpServer.EnableSsl = Convert.ToBoolean(_configuration.GetSection("MailSettingServer:EnableSsl").Value);

            try
            {
                smtpServer.Send(mail);
                operationResult = new OperationResult { Success = true, Message = "Send mail was successfuly." };

            }
            catch (Exception ex)
            {
                operationResult = new OperationResult { Success = false, Message = ex.Message };
            }

            mail.Dispose();
            smtpServer.Dispose();
            return operationResult;
        }

        public async Task<OperationResult> SendMailAsync(string toMail, string subject, string content, string filePath)
        {
            MailMessage mail = new MailMessage();
            var test = _configuration.GetSection("MailSettingServer:Server").Value;
            SmtpClient smtpServer = new SmtpClient(_configuration.GetSection("MailSettingServer:Server").Value);
            mail.From = new MailAddress(_configuration.GetSection("MailSettingServer:FromEmail").Value, _configuration.GetSection("MailSettingServer:FromName").Value);

            mail.To.Add(toMail);
            mail.Subject = subject;
            mail.SubjectEncoding = System.Text.Encoding.UTF8;
            mail.Body = content;
            mail.BodyEncoding = System.Text.Encoding.UTF8;

            if (!string.IsNullOrEmpty(filePath))
            {
                System.Net.Mail.Attachment attachment;
                attachment = new System.Net.Mail.Attachment(filePath);
                mail.Attachments.Add(attachment);
            }

            smtpServer.Port = Convert.ToInt32(_configuration.GetSection("MailSettingServer:Port").Value);
            smtpServer.Credentials = new NetworkCredential(_configuration.GetSection("MailSettingServer:UserName").Value, _configuration.GetSection("MailSettingServer:Password").Value);
            smtpServer.EnableSsl = Convert.ToBoolean(_configuration.GetSection("MailSettingServer:EnableSsl").Value);

            try
            {
                await smtpServer.SendMailAsync(mail);
                operationResult = new OperationResult { Success = true, Message = "Send mail to '" + toMail + "' was successfuly." };
            }
            catch (Exception ex)
            {
                operationResult = new OperationResult { Success = false, Message = ex.Message };
            }

            mail.Dispose();
            smtpServer.Dispose();
            return operationResult;
        }

        public async Task<OperationResult> SendListMailAsync(List<string> toMail, List<string> ccMail, string subject, string content, string filePath)
        {
            MailMessage mail = new MailMessage();
            var test = _configuration.GetSection("MailSettingServer:Server").Value;
            SmtpClient smtpServer = new SmtpClient(_configuration.GetSection("MailSettingServer:Server").Value);
            mail.From = new MailAddress(_configuration.GetSection("MailSettingServer:FromEmail").Value, _configuration.GetSection("MailSettingServer:FromName").Value);

            foreach (var item in toMail)
            {
                mail.To.Add(item);
            }
            foreach (var item in ccMail)
            {
                mail.CC.Add(item);
            }
            mail.Subject = subject;
            mail.SubjectEncoding = System.Text.Encoding.UTF8;
            mail.Body = content;
            mail.BodyEncoding = System.Text.Encoding.UTF8;

            if (!string.IsNullOrEmpty(filePath))
            {
                System.Net.Mail.Attachment attachment;
                attachment = new System.Net.Mail.Attachment(filePath);
                mail.Attachments.Add(attachment);
            }

            smtpServer.Port = Convert.ToInt32(_configuration.GetSection("MailSettingServer:Port").Value);
            smtpServer.Credentials = new NetworkCredential(_configuration.GetSection("MailSettingServer:UserName").Value, _configuration.GetSection("MailSettingServer:Password").Value);
            smtpServer.EnableSsl = Convert.ToBoolean(_configuration.GetSection("MailSettingServer:EnableSsl").Value);

            try
            {
                await smtpServer.SendMailAsync(mail);
                operationResult = new OperationResult { Success = true, Message = "Send mail was successfuly." };
            }
            catch (Exception ex)
            {
                operationResult = new OperationResult { Success = false, Message = ex.Message };
            }

            mail.Dispose();
            smtpServer.Dispose();
            return operationResult;
        }
    }
}