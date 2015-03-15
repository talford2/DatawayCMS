using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dataway.Admin.ViewModels
{
    public class LoginViewModel : BaseViewModel
    {
        public bool IncorrectUsernameAndPassword { get; set; }

        public override string Title
        {
            get
            {
                return "Login";
            }
        }
    }
}