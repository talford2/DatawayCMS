using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Dataway.Cms;
using Dataway.Cms.Core;

namespace Dataway.Admin.ViewModels
{
    public class AssetsViewModel : BaseViewModel
    {
        public List<CmsAsset> Assets { get; set; }

        public List<CmsAssetCategory> Categories { get; set; }

        public int? CategoryId { get; set; }

        public override string Title
        {
            get
            {
                return "Assets";
            }
        }
    }
}