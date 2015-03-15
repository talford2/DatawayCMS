using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Dataway.Cms;
using Dataway.Cms.Core;

namespace Dataway.Admin.ViewModels
{
    public class SettingsViewModel : BaseViewModel
    {
        public List<CmsSetting> Settings { get; set; }

        private List<CmsSite> sites;
        public List<CmsSite> Sites
        {
            get
            {
                if (sites == null)
                {
                    sites = CmsSite.GetAll();
                }
                return sites;
            }
        }

        public override string Title
        {
            get
            {
                return "Settings";
            }
        }
    }
}