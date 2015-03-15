using System;
using System.Linq;
using System.Web.Mvc;
using Dataway.Admin.Attributes;
using Dataway.Admin.ViewModels;
using Dataway.Cms;
using Dataway.MvcLibrary.Helpers;

namespace Dataway.Admin.Controllers
{
    public class SettingsController : Controller
    {
        [UserAccessAttribute(true, false, true)]
        public ActionResult Settings()
        {
            var model = new SettingsViewModel();
            model.SelectMenu = SelectedMenuItem.Settings;

            if (Common.LoggedInUser.IsAdmin)
            {
                model.Settings = CmsSetting.GetAllSettings();
                return View(model);
            }

            model.Settings = CmsSetting.GetPublicSettings();

            return View("PublicSettings", model);
        }

        [HttpPost]
        [UserAccessAttribute(true, true, true)]
        public ActionResult New(FormCollection form)
        {
            CmsSetting setting = new CmsSetting();

            setting.Key = form.Value<string>("Key");
            setting.Type = form.Value<string>("Type");
            setting.PublicAccess = form.Contains("PublicAccess");
            setting.Value = form.Value<string>("Value");
            setting.SiteId = form.Value<int?>("SiteId");

            setting.Save();

            return Redirect("/settings");
        }

        [HttpPost]
        [UserAccessAttribute(true, false, true)]
        public ActionResult Save(FormCollection form)
        {
            var settingIds = form.AllKeys.Where(d => d.StartsWith("key_")).Select(d => d.Split('_')[1]).ToList();

            foreach (var settingId in settingIds)
            {
                CmsSetting setting = new CmsSetting();

                if (Common.LoggedInUser.IsAdmin)
                {
                    setting.Id = int.Parse(settingId);
                    setting.Key = form.Value<string>("key_" + settingId);
                    setting.Type = form.Value<string>("type_" + settingId);
                    setting.PublicAccess = form.Contains("access_" + settingId);
                    setting.SiteId = form.Value<int?>("site_" + settingId);
                }
                else
                {
                    setting = CmsSetting.GetSetting(int.Parse(settingId));
                }

                // Set values
                switch (setting.Type)
                {
                    case "bool":
                        bool check = false;
                        check = form.Contains("value_" + settingId);
                        setting.Value = check.ToString();
                        break;
                    default:
                        setting.Value = form.Value<string>("value_" + settingId);
                        break;
                }


                setting.Save();
            }

            return Redirect("/settings");
        }

        [HttpPost]
        [UserAccessAttribute(true, true, true)]
        public ActionResult Delete(int settingId)
        {
            CmsSetting.DeleteSetting(settingId);
            return new EmptyResult();
        }
    }
}
