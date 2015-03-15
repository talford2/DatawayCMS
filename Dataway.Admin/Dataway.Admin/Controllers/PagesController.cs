using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web.Mvc;
using Dataway.Admin.Attributes;
using Dataway.Admin.ViewModels;
using Dataway.Cms;
using Dataway.Cms.Core;
using Dataway.MvcLibrary.Helpers;

namespace Dataway.Admin.Controllers
{
	public class PagesController : Controller
	{
		[UserAccessAttribute(true, false, true)]
		public ActionResult List()
		{
			var model = new PagesViewModel();
			model.Pages = CmsPage.GetPageTree(true, CmsCommon.CurrentSite.Id);
			model.SelectMenu = SelectedMenuItem.Pages;
			return View(model);
		}

		[UserAccessAttribute(true, false, true)]
		public ActionResult AddEdit(int? id)
		{
			var model = new PageViewModel();
            model.SelectMenu = SelectedMenuItem.Pages;

			model.Pages = CmsPage.GetPageTree(true, CmsCommon.CurrentSite.Id);
			if (id.HasValue)
			{
				model.Page = CmsPage.GetPage(id.Value);

                if (Common.LoggedInUser.Settings.PageSettings != null)
                {
                    model.PageSettings = Common.LoggedInUser.Settings.PageSettings.FirstOrDefault(p => p.PageId == id.Value);
                }
			}
			else
			{
				model.Page = new CmsPage();
				model.Page.IsActive = true;

				if (Request.QueryString.Contains("parent"))
				{
					model.Page.ParentId = Request.QueryString.Value<int>("parent");
				}
				if (Request.QueryString.Contains("template"))
				{
					model.Page.CmsTemplatePageId = Request.QueryString.Value<int>("template");
				}
			}

            
			return View(model);
		}

		[HttpPost]
		[ValidateInput(false)]
		[UserAccessAttribute(true, false, true)]
		public ActionResult AddEdit(FormCollection form)
		{
			var page = new CmsPage();
			page.SiteId = CmsCommon.CurrentSite.Id;
			page.Id = form.Value<int>("Id");
			page.Name = form.Value<string>("Name");
			page.Key = form.Value<string>("Key");
			page.FriendlyUrl = form.Value<string>("FriendlyUrl");
			page.CmsTemplatePageId = form.Value<int>("CmsTemplatePageId");
			page.Xml = form.Value<string>("xml");
			page.ParentId = form.Value<int?>("ParentId");
			page.IsActive = form.Contains("IsActive");
            page.ShowInNavigation = form.Contains("ShowInNavigation");
			page.Save();
			return Redirect(string.Format("/page/{0}", page.Id));
		}

		[HttpPost]
		[UserAccessAttribute(true, false, false)]
		public ActionResult Delete(int id)
		{
			CmsPage.DeletePage(id);
			return new EmptyResult();
		}

		[UserAccessAttribute(true, false, false)]
		public ActionResult SetActive(int id, bool isActive)
		{
			CmsPage.SetActivate(id, isActive);
			return new EmptyResult();
		}

		//[HttpPost]
		[UserAccessAttribute(true, false, false)]
		public ActionResult ReorderPages(FormCollection form)
		{
			var pageIds = form.Value<string>("PageIds").Split(',').Select(d => int.Parse(d)).ToArray();
			CmsPage.ReorderPages(pageIds);
			return new EmptyResult();
		}

		[UserAccessAttribute(true, false, false)]
		public ActionResult GetSuggestedFriendlyUrls(string name, int? parentId)
		{
            List<string> suggestions = new List<string>();

            string url = "/";

            if (parentId.HasValue)
            {
                var parents = CmsPage.GetPage(parentId.Value).GetAncestors();
                foreach (var parent in parents)
                {
                    url += GetFriendlyUrl(parent.Name) + "/";
                }
                url += GetFriendlyUrl(CmsPage.GetPage(parentId.Value).Name) + "/";
            }

            if (!string.IsNullOrWhiteSpace(name))
            {
                url += GetFriendlyUrl(name);
            }

            suggestions.Add(url);

            return Json(suggestions);
		}

		private string GetFriendlyUrl(string value)
		{
			if (!string.IsNullOrWhiteSpace(value))
			{
				string friendly = value.ToLower();
				// invalid chars           
				friendly = Regex.Replace(friendly, @"[^a-z0-9\s-]", "");
				// convert multiple spaces into one space   
				friendly = Regex.Replace(friendly, @"\s+", " ").Trim();
				// cut and trim 
				friendly = friendly.Substring(0, friendly.Length <= 45 ? friendly.Length : 45).Trim();
				friendly = Regex.Replace(friendly, @"\s", "-"); // hyphens   
				return friendly;
			}
			return value;
		}
	}
}
