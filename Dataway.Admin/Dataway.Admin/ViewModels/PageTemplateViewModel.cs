using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Dataway.Cms;

namespace Dataway.Admin.ViewModels
{
    public class PageTemplateViewModel : BaseViewModel
    {
        public CmsPageTemplate Template { get; set; }

        public override string PageCssClass
        {
            get
            {
                return "template-page";
            }
        }
    }
}