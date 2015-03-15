using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Dataway.Cms.Core;

namespace Dataway.Admin.ViewModels
{
    public class AssetCategoryListViewModel : BaseViewModel
    {
        public List<CmsAssetCategory> Categories { get; set; }

        public override string Title
        {
            get
            {
                return "Asset Categories";
            }
        }
    }
}