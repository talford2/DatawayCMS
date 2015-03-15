using System;
using System.Web.Mvc;
using Dataway.Admin.Attributes;
using Dataway.Admin.ViewModels;
using Dataway.Cms;
using Dataway.MvcLibrary.Helpers;
using System.Linq;
using Dataway.Cms.Core;

namespace Dataway.Admin.Controllers
{
    public class PageTemplatesController : Controller
    {
        [UserAccessAttribute(true, false, true)]
        public ActionResult List()
        {
            var model = new PageTemplatesViewModel();

            if (Common.LoggedInUser.IsAdmin)
            {
                model.Templates = CmsPageTemplate.GetAllTemplates();
            }
            else
            {
                model.Templates = CmsPageTemplate.GetAllTemplates().Where(t => t.SiteId.HasValue && t.SiteId == CmsCommon.CurrentSite.Id).ToList();
            }
            model.SelectMenu = SelectedMenuItem.PageTemplates;
            return View(model);
        }

        [UserAccessAttribute(true, false, true)]
        public ActionResult AddEdit(int? id)
        {
            var model = new PageTemplateViewModel();
            model.SelectMenu = SelectedMenuItem.PageTemplates;

            if (id.HasValue)
            {
                model.Template = CmsPageTemplate.GetTemplate(id.Value);
            }
            else
            {
                model.Template = new CmsPageTemplate();
            }
            return View(model);
        }

        [HttpPost]
        [ValidateInput(false)]
        [UserAccessAttribute(true, false, true)]
        public ActionResult AddEdit(FormCollection form)
        {
            CmsPageTemplate template = new CmsPageTemplate();
            template.SiteId = form.Value<int?>("SiteId");
            template.Id = form.Value<int>("Id");
            template.Key = form.Value<string>("Key");
            template.TemplateName = form.Value<string>("TemplateName").Trim();
            template.IconId = form.Value<int?>("IconId");
            template.RenderUrl = form.Value<string>("RenderUrl").Trim();
            template.Xml = form.Value<string>("Xml").Trim();
            template.Save();
            return Redirect(string.Format("/page-template/{0}", template.Id));
        }

        [HttpPost]
        [UserAccessAttribute(true, false, true)]
        public ActionResult Delete(int pageTemplateId)
        {
            CmsPageTemplate.DeleteTemplate(pageTemplateId);
            return new EmptyResult();
        }
    }
}
