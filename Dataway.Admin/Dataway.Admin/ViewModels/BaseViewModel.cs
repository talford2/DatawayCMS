using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Dataway.Cms;
using Dataway.Cms.Core;

namespace Dataway.Admin.ViewModels
{
    public abstract class BaseViewModel
    {
        //public CmsUser LoggedInUser
        //{
        //    get
        //    {
        //        return Common.LoggedInUser;
        //    }
        //    set
        //    {
        //        this.Sites = null;
        //        Common.LoggedInUser = value;
        //    }
        //}

        //public List<CmsSite> Sites
        //{
        //    get
        //    {
        //        if (HttpContext.Current.Session["Sites"] == null)
        //        {
        //            HttpContext.Current.Session["Sites"] = CmsSite.GetUserAccessSites(LoggedInUser.Id);
        //        }
        //        return HttpContext.Current.Session["Sites"] as List<CmsSite>;
        //    }
        //    set
        //    {
        //        HttpContext.Current.Session["Sites"] = value;
        //    }
        //}

        public List<CmsTemplateIcon> Icons
        {
            get
            {
                return CmsTemplateIcon.GetAll();
            }
        }

        public SelectedMenuItem SelectMenu { get; set; }

        public virtual string Title { get; set; }

        public virtual string PageCssClass { get { return null; } }
    }

    public enum SelectedMenuItem
    {
        None,
        Pages,
        SiteSearch,
        Assets,
        AssetCategories,
        Settings,
        PageTemplates,
        Users,
        Sites
    }
}