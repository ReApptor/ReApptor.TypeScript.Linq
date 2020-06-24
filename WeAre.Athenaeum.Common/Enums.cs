﻿
namespace WeAre.Athenaeum.Common
{
    public enum WebApplicationType
    {
        DesktopBrowser,

        MobileBrowser,

        MobileApp,

        PwaApp
    }

    public enum TokenType
    {
        Service,

        Mobile,

        Email,
        
        Login
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

    public enum AuthType
    {
        Email,
        
        Phone
    }
    
    public enum SavePasswordResultStatus
    {
        Success,
        
        WeakPassword,
        
        WrongCurrent
    }
}