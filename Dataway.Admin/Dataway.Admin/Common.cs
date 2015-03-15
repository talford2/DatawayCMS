using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Dataway.Cms.AccessRights;
using Dataway.Cms.Core;
using Dataway.MvcLibrary;

namespace Dataway.Admin
{
    public static class Common
    {
        public static int? RememberUserId
        {
            get
            {
                return CookieManager.Get<int?>("RememberUserId");
            }
            set
            {
                if (value.HasValue)
                {
                    CookieManager.Set("RememberUserId", value, DateTime.Now.AddMonths(1));
                }
                else
                {
                    CookieManager.Remove("RememberUserId");
                }
            }
        }

        public static CmsUser LoggedInUser
        {
            get
            {
                return HttpContext.Current.Session["LoggedInUser"] as CmsUser;
            }
            set
            {
                Sites = null;
                AccessRights = null;
                HttpContext.Current.Session["LoggedInUser"] = value;
            }
        }

        public static List<CmsSite> Sites
        {
            get
            {
                if (HttpContext.Current.Session["Sites"] == null)
                {
                    HttpContext.Current.Session["Sites"] = CmsSite.GetUserAccessSites(LoggedInUser.Id);
                }
                return HttpContext.Current.Session["Sites"] as List<CmsSite>;
            }
            set
            {
                HttpContext.Current.Session["Sites"] = value;
            }
        }

        private static List<CmsUserSiteAccess> AccessRights
        {
            get
            {
                if (HttpContext.Current.Session["AccessRights"] == null)
                {
                    HttpContext.Current.Session["AccessRights"] = CmsUserSiteAccess.GetUserAccess(LoggedInUser.Id);
                }
                return HttpContext.Current.Session["AccessRights"] as List<CmsUserSiteAccess>;
            }
            set
            {
                HttpContext.Current.Session["AccessRights"] = value;
            }
        }

        public static bool HasAccess(string key)
        {
            var acc = CmsUserSiteAccessType.GetAll().FirstOrDefault(f => f.Key == key);

            var aaaa = AccessRights.FirstOrDefault(a => a.AccessTypeId == acc.Id && a.SiteId == CmsCommon.CurrentSite.Id);
            if (aaaa != null && aaaa.HasAccess)
            {
                return true;
            }
            return false;
        }
    }
}