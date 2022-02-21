
namespace WeAre.TestApplication.WebUI.Server.Models
{
    public class UserContext : ApplicationContext
    {
        #region Constructors
        
        public UserContext()
        {
        }

        //public UserContext(ApplicationContext context, User user, UserRole[] roles)
        public UserContext(ApplicationContext context)
            : base(context)
        {
            //User = user ?? throw new ArgumentNullException(nameof(user));
            //Roles = roles ?? new UserRole[0];
        }
        
        #endregion
        
        #region Properties

        // public string Username => User?.Username;
        //
        // public string Email => User?.Email;
        //
        // public string Phone => User?.Phone;
        //
        // public string SecurityStamp => User?.SecurityStamp.ToString();

        //public User User { get; set; }

        //public UserRole[] Roles { get; set; }
        
        public bool IsUserContext => true;
        
        #endregion
    }
}