using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Dataway.Cms;
using Dataway.Cms.Core;

namespace Dataway.Admin.ViewModels
{
    public class PagesViewModel : BaseViewModel
    {
        public Tree<CmsPage> Pages { get; set; }

        public override string Title
        {
            get
            {
                return "Pages";
            }
        }
    }
}