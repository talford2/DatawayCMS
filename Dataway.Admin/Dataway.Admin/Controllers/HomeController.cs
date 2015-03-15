using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Dataway.Admin.ViewModels;
using Dataway.Admin.Attributes;

namespace Dataway.Admin.Controllers
{
    public class HomeController : Controller
    {
        [UserAccessAttribute(true, false, true)]
        public ActionResult Home()
        {
            var model = new HomeViewModel();
            return View(model);
        }
    }
}
