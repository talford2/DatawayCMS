using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Dataway.Cms;
using Dataway.Cms.Core;

namespace Dataway.Admin.ViewModels
{
    public class AssetViewModel : BaseViewModel
    {
        public CmsAsset Asset { get; set; }

        public List<CmsAssetCategory> Categories { get; set; }
    }
}