using WeAre.Athenaeum.Common.Helpers;

namespace WeAre.Athenaeum.TemplateApp.WebUI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            ProgramHelper.Start<Startup>(args);
        }
    }
}