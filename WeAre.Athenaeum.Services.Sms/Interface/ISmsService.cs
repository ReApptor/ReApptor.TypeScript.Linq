using System.Threading.Tasks;
using WeAre.Athenaeum.Services.Sms.Models;

namespace WeAre.Athenaeum.Services.Sms.Interface
{
    public interface ISmsService
    {
        Task<SmsResponse> SendAsync(SmsMessage message);
    }
}