using System;
using System.Web.Mvc;
using Dataway.Admin.Attributes;
using Dataway.Admin.ViewModels;
using Dataway.Cms.Core;
using Dataway.MvcLibrary.Helpers;
using System.Linq;
using Dataway.Cms.AccessRights;
using System.Collections.Generic;

namespace Dataway.Admin.Controllers
{
    public class UsersController : Controller
    {
        [UserAccessAttribute(true, true, true)]
        public ActionResult List()
        {
            var model = new UsersViewModel();
            model.Users = CmsUser.GetAll();
            model.SelectMenu = SelectedMenuItem.Users;
            return View(model);
        }

        [UserAccessAttribute(true, true, true)]
        public ActionResult AddEdit(int? userId)
        {
            var model = new UserViewModel();
            model.SelectMenu = SelectedMenuItem.Users;

            if (userId.HasValue)
            {
                model.User = CmsUser.GetUser(userId.Value);
            }
            else
            {
                model.User = new CmsUser();
                model.User.IsActive = true;
            }

            return View(model);
        }

        [UserAccessAttribute(true, true, true)]
        [HttpPost]
        public ActionResult AddEdit(FormCollection form)
        {
            var model = new UserViewModel();

            var id = form.Value<int>("CmsUserId");

            if (id == 0)
            {
                model.User = new CmsUser();
            }
            else
            {
                model.User = CmsUser.GetUser(id);
            }

            model.User.Username = form.Value<string>("Username");
            model.User.Password = form.Value<string>("Password");
            model.User.IsActive = form.Contains("IsActive");
            model.User.IsAdmin = form.Contains("IsAdmin");

            model.User.Save();

            // Setting Access
            List<CmsUserSiteAccess> a = new List<CmsUserSiteAccess>();
            var accessKeys = form.AllKeys.Where(k => k.StartsWith("Access_"));
            foreach (var accessKey in accessKeys)
            {
                var bits = accessKey.Replace("Access_", "").Split('_');
                a.Add(new CmsUserSiteAccess
                {
                    SiteId = int.Parse(bits[0]),
                    AccessTypeId = int.Parse(bits[1]),
                    UserId = model.User.Id,
                    HasAccess = true
                });
            }
            CmsUserSiteAccess.SetUsersAccess(model.User.Id, a);

            // Clear the sites incase user rights means your access has changed
            Common.Sites = null;
            if (!Common.Sites.Any(s => s.Id == CmsCommon.CurrentSite.Id))
            {
                CmsCommon.CurrentSite = CmsSite.GetUserAccessSites(Common.LoggedInUser.Id).FirstOrDefault();
                //CmsCommon.CurrentSite = null;
            }

            return View(model);
        }
    }
}
