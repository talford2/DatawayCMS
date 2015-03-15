using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Dataway.Admin.Attributes
{
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class)]
    public class UserAccessAttribute : AuthorizeAttribute
    {
        #region Public Properties

        public bool RequiresLogin { get; set; }

        public bool RequiresAdmin { get; set; }

        public bool Redirect { get; set; }

        #endregion

        #region Constructor

        public UserAccessAttribute(bool requiresLogin, bool adminOnly, bool redirect)
        {
            this.RequiresLogin = requiresLogin;
            this.Redirect = redirect;
            this.RequiresAdmin = adminOnly;
        }

        #endregion

        #region Event Handlers

        protected override bool AuthorizeCore(HttpContextBase httpContext)
        {
            bool isValidLogin = true;

            if (Common.LoggedInUser == null && this.RequiresLogin)
            {
                isValidLogin = false;
            }
            else if (Common.LoggedInUser != null && Common.LoggedInUser.IsAdmin == false && this.RequiresAdmin)
            {
                isValidLogin = false;
            }

            if (!isValidLogin)
            {
                if (this.Redirect)
                {
                    httpContext.Response.Redirect(string.Format("/login?url={0}", httpContext.Request.RawUrl));
                    return false;
                }
                else
                {
                    throw new UnauthorizedAccessException("Must be logged in for this request.");
                }
            }

            return true;
        }

        #endregion
    }
}