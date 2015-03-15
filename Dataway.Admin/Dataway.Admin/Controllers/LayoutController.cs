using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Dataway.Cms.Core;

namespace Dataway.Admin.Controllers
{
    public class LayoutController : Controller
    {
        public ActionResult SetSite(int siteId)
        {
            CmsCommon.CurrentSite = CmsSite.Get(siteId);

            Common.LoggedInUser.Settings.ViewSiteId = siteId;
            Common.LoggedInUser.Save();

            return new EmptyResult();
        }
    }
}
