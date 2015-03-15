using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Dataway.Cms;
using Dataway.Cms.Core;

namespace Dataway.Admin.ViewModels
{
    public class PageViewModel : BaseViewModel
    {
        public CmsPage Page { get; set; }

        public Tree<CmsPage> Pages { get; set; }

        public List<CmsPageTemplate> PageTemplates
        {
            get
            {
                return CmsPageTemplate.GetAllTemplates(CmsCommon.CurrentSite.Id);
            }
        }

        public CmsUserPageSettings PageSettings { get; set; }

        public override string Title
        {
            get
            {
                if (this.Page != null && !string.IsNullOrWhiteSpace(this.Page.Name))
                {
                    return "Edit Page - " + this.Page.Name;
                }
                return "New Page";
            }
        }
    }
}