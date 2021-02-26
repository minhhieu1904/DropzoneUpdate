using System.Threading.Tasks;
using API._Services.Interfaces;
using API.Dtos;
using API.Helpers.Utilities;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class SendMailController : ApiController
    {
        private readonly ISendMailService _sendMailService;
        private readonly IMailUtility _mailUtility;
        private readonly ISendMailByGmail _sendMailByGmail;

        public SendMailController(
            ISendMailService sendMailService,
            IMailUtility mailUtility, 
            ISendMailByGmail sendMailByGmail)
        {
            _sendMailService = sendMailService;
            _mailUtility = mailUtility;
            _sendMailByGmail = sendMailByGmail;
        }

        [HttpPost]
        public async Task<IActionResult> SendMail(MailContent mailContent)
        {
            return Ok(await _sendMailService.SendMail(mailContent));
        }

        [HttpPost("sendMailUtility")]
        public async Task<IActionResult> SendMailUtility(MailContent mailContent)
        {
            return Ok(await _mailUtility.SendMailAsync(mailContent.To, mailContent.Subject, mailContent.Body));
        }

        [HttpPost("sendMailByGmail")]
        public async Task<IActionResult> SendMailByGmail(MailContent mailContent)
        {
            return Ok(await _sendMailByGmail.SendMailLocalSmtp(mailContent));
        }
    }
}