using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Dataway.Cms;

namespace Dataway.Admin.ViewModels
{
    public class SearchViewModel : BaseViewModel
    {
        public string Term { get; set; }

        public List<CmsSearchResult> Results { get; set; }

        public DateTime IndexLastUpdated { get; set; }
    }
}