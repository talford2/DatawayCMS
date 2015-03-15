using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Dataway.Cms;
using Dataway.Cms.TemplateComponents;

namespace Dataway.Admin.ViewModels
{
    public class ComponentsViewModel
    {
        public List<CmsTemplateComponent> Components { get; set; }

        public CmsPage Page { get; set; }
    }
}