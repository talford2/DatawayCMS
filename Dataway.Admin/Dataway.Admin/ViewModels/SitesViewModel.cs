using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Dataway.Cms.Core;

namespace Dataway.Admin.ViewModels
{
    public class SitesViewModel : BaseViewModel
    {
        public List<CmsSite> Sites
        {
            get
            {
                return CmsSite.GetAll();
            }
        }

        public override string Title
        {
            get
            {
                return "Sites";
            }
        }
    }
}