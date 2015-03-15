using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Dataway.Cms.Core;

namespace Dataway.Admin.ViewModels
{
    public class UsersViewModel : BaseViewModel
    {
        public List<CmsUser> Users { get; set; }

        public override string Title
        {
            get
            {
                return "Users";
            }
        }
    }
}