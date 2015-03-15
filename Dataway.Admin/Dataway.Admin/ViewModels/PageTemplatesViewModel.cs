using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Dataway.Cms;

namespace Dataway.Admin.ViewModels
{
    public class PageTemplatesViewModel : BaseViewModel
    {
        public List<CmsPageTemplate> Templates { get; set; }

        public override string Title
        {
            get
            {
                return "Page Templates";
            }
        }
    }
}