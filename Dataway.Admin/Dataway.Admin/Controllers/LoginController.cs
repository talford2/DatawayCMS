using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Web.Mvc;
using Dataway.Admin.Attributes;
using Dataway.Admin.ViewModels;
using Dataway.Cms.Core;
using Dataway.Extensions;
using Dataway.Extensions.Encryption;
using Dataway.MvcLibrary.Helpers;

namespace Dataway.Admin.Controllers
{
    public class LoginController : Controller
    {
        [UserAccessAttribute(false, false, true)]
        public ActionResult Login()
        {
            if (Common.RememberUserId.HasValue)
            {
                Common.LoggedInUser = CmsUser.GetUser(Common.RememberUserId.Value);
            }

            if (Common.LoggedInUser != null)
            {
                if (!string.IsNullOrWhiteSpace(Request.QueryString["url"]))
                {
                    return Redirect(Request.QueryString["url"]);
                }
                return Redirect("/");
            }

            var model = new LoginViewModel();
            return View(model);
        }

        [HttpPost]
        [UserAccessAttribute(false, false, true)]
        public ActionResult Login(FormCollection form)
        {
            Common.LoggedInUser = CmsUser.GetUser(form.Value<string>("Username"), form.Value<string>("Password"));
            if (Common.LoggedInUser == null)
            {
                var model = new LoginViewModel();
                model.IncorrectUsernameAndPassword = true;
                return View(model);
            }

            CmsCommon.CurrentSite = CmsSite.GetAll()[0];
            if (Common.LoggedInUser.Settings.ViewSiteId.HasValue)
            {
                CmsCommon.CurrentSite = CmsSite.Get(Common.LoggedInUser.Settings.ViewSiteId.Value);
            }

            if (form.Contains("RememberMe"))
            {
                Common.RememberUserId = Common.LoggedInUser.Id;
            }
            else
            {
                Common.RememberUserId = null;
            }

            if (!string.IsNullOrEmpty(this.Request.QueryString.Value<string>("url")))
            {
                return Redirect(this.Request.QueryString.Value<string>("url"));
            }
            return Redirect("/");
        }

        public ActionResult Logout()
        {
            Common.LoggedInUser = null;
            Common.RememberUserId = null;
            return Redirect("/login");
        }


        [UserAccess(true, false, false)]
        public ActionResult SetPageExpand(int pageId, bool isExpanded)
        {
            Common.LoggedInUser.Settings.CollapsedPages[pageId] = isExpanded;
            Common.LoggedInUser.Save();
            return new EmptyResult();
        }

        [UserAccess(true, false, false)]
        public ActionResult SetCollapsedItems(int pageId, string collapsedItems)
        {
            CmsUserPageSettings newSetting = new CmsUserPageSettings();

            List<bool> collapsed = new List<bool>();
            foreach (char character in collapsedItems)
            {
                collapsed.Add(character == '1');
            }

            var pageSetting = Common.LoggedInUser.Settings.PageSettings.FirstOrDefault(c => c.PageId == pageId);
            if (pageSetting == null)
            {
                pageSetting = new CmsUserPageSettings();
                pageSetting.PageId = pageId;
                Common.LoggedInUser.Settings.PageSettings.Add(pageSetting);
            }

            pageSetting.CollapisedItems = collapsed;
            //Common.Instance.LoggedInUser.Settings.PageSettings.First(c => c.PageId == pageId).CollapisedItems = collapsed;

            Common.LoggedInUser.Save();
            return new EmptyResult();
        }

        [UserAccess(false, false, false)]
        public ActionResult ForgotPassword()
        {
            return View();
        }

        [HttpPost]
        [UserAccess(false, false, false)]
        public ActionResult ForgotPassword(FormCollection form)
        {
            var secure = Encryption.GetOneWayEncryption("secure");

            string email = form.Value<string>("Email");

            var password = StringExtensions.GenerateRandomString(10, 12);
            if (CmsUser.SetPassword(email, password))
            {
                MailMessage message = new MailMessage("no-reply@dataway.com.au", email);
                message.Subject = "Dataway CMS Password Reset";
                message.IsBodyHtml = true;
                message.Body = string.Format("You password has been reset to: {0}", password);
                SmtpClient client = new SmtpClient();
                client.Send(message);
            }

            return View();
        }
    }
}
