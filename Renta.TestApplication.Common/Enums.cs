
namespace WeAre.Athenaeum.TemplateApp.Common
{
    public enum WebApplicationType
    {
        DesktopBrowser,

        MobileBrowser,

        MobileApp,

        PwaApp
    }
    
    public enum LoginResultStatus
    {
        Success,

        NotFound,

        Deleted,

        Locked,

        /// <summary>
        /// Token security stamp does not correspond to user security stamp
        /// </summary>
        TokenInvalidSecurityStamp,
        
        /// <summary>
        /// Token already used
        /// </summary>
        TokenUsed,
        
        /// <summary>
        /// Token invalid or expired
        /// </summary>
        TokenInvalidOrExpired
    }

    public enum OrganizationContractLevel
    {
        Operator = 0,

        Company = 1,

        SubCompany = 2
    }
    
    public enum OrganizationContractType
    {
        Customer = 0,
        
        Subcontractor = 1
    }

    public enum UserRoleGroup
    {
        Admins,
        
        Managers,
        
        Employees,
        
        ContactPersons
    }
    
    public enum PasswordValidationError
    {
        /// <summary>
        /// One lowercase ('a'-'z') characters.
        /// </summary>
        Lowercase,
    
        /// <summary>
        /// One uppercase ('A'-'Z') characters.
        /// </summary>
        Uppercase,
    
        /// <summary>
        /// One non alphanumeric characters.
        /// </summary>
        NonAlphabetic,
    
        /// <summary>
        /// Min 6 and at max 100 characters long.
        /// </summary>
        Length
    }
    
    public enum SavePasswordResultStatus
    {
        Success,
        
        WeakPassword,
        
        WrongCurrent
    }
    
    public enum InvitationType
    {
        /// <summary>
        /// Set password by Admin
        /// </summary>
        Invitation,
        
        /// <summary>
        /// Reset password by Admin
        /// </summary>
        ResetPassword,
        
        /// <summary>
        /// Reset password by User
        /// </summary>
        ForgotPassword
    }

    public enum AuditTimestamp
    {
        CreatedAt,

        ModifiedAt
    }

    public enum AuthType
    {
        Email,
        
        Phone
    }

    public enum SortDirection
    {
        Asc,

        Desc
    }
}