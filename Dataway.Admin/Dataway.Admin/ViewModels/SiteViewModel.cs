using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Dataway.Cms.Core;

namespace Dataway.Admin.ViewModels
{
    public class SiteViewModel : BaseViewModel
    {
        public CmsSite Site { get; set; }
    }
}