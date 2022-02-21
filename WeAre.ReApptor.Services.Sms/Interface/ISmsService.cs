using System.Threading.Tasks;
using WeAre.ReApptor.Services.Sms.Models;

namespace WeAre.ReApptor.Services.Sms.Interface
{
    public interface ISmsService
    {
        Task<SmsResponse> SendAsync(SmsMessage message);
    }
}