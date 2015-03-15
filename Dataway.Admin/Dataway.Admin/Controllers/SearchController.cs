using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Dataway.Admin.Attributes;
using Dataway.Admin.ViewModels;
using Dataway.Cms;

namespace Dataway.Admin.Controllers
{
    public class SearchController : Controller
    {
        [UserAccessAttribute(true, false, true)]
        public ActionResult Search()
        {
            var model = new SearchViewModel();
            model.SelectMenu = SelectedMenuItem.SiteSearch;
            model.IndexLastUpdated = CmsSearcher.GetLastUpdated();
            return View(model);
        }

        [HttpPost]
        [UserAccessAttribute(true, false, true)]
        public ActionResult Search(string term)
        {
            var model = new SearchViewModel();
            model.SelectMenu = SelectedMenuItem.SiteSearch;
            model.Term = term;
            model.Results = CmsSearcher.GetSearchResults(term);
            model.IndexLastUpdated = CmsSearcher.GetLastUpdated();
            return View(model);
        }

        public ActionResult ReindexSearh()
        {
            CmsSearcher.IndexContent();
            return new EmptyResult();
        }
    }
}
