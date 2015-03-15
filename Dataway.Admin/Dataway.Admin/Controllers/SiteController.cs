using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Dataway.Admin.Attributes;
using Dataway.Admin.ViewModels;
using Dataway.Cms.Core;
using Dataway.MvcLibrary.Helpers;

namespace Dataway.Admin.Controllers
{
    public class SiteController : Controller
    {
        [UserAccessAttribute(true, false, true)]
        public ActionResult List()
        {
            var model = new SitesViewModel();
            model.SelectMenu = SelectedMenuItem.Sites;
            return View(model);
        }

        [UserAccessAttribute(true, false, true)]
        public ActionResult AddEdit(int? siteId)
        {
            var model = new SiteViewModel();
            model.SelectMenu = SelectedMenuItem.Sites;

            if (siteId.HasValue)
            {
                model.Site = CmsSite.Get(siteId.Value);
            }
            else
            {
                model.Site = new Cms.Core.CmsSite();
            }

            return View(model);
        }

        [UserAccessAttribute(true, false, true)]
        [HttpPost]
        public ActionResult AddEdit(FormCollection form)
        {
            var model = new SiteViewModel();

            var site = CmsSite.Get(form.Value<int>("Id"));
            if (site == null)
            {
                site = new CmsSite();
            }
            site.Name = form.Value<string>("Name");
            site.Url = form.Value<string>("Url");
            site.Save();

            model.Site = site;

            return View(model);
        }
    }
}
