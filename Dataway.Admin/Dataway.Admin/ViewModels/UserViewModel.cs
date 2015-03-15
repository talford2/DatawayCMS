using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Dataway.Cms.AccessRights;
using Dataway.Cms.Core;

namespace Dataway.Admin.ViewModels
{
    public class UserViewModel : BaseViewModel
    {
        public CmsUser User { get; set; }

        private List<CmsSite> allSites;
        public List<CmsSite> AllSites
        {
            get
            {
                if (allSites == null)
                {
                    allSites = CmsSite.GetAll();
                }
                return allSites;
            }
        }

        private List<CmsUserSiteAccessType> accessTypes;
        public List<CmsUserSiteAccessType> AccessTypes
        {
            get
            {
                if (accessTypes == null)
                {
                    accessTypes = CmsUserSiteAccessType.GetAll();
                }
                return accessTypes;
            }
        }

        public List<CmsUserSiteAccess> access;
        public List<CmsUserSiteAccess> Access
        {
            get
            {
                if (access == null)
                {
                    access = CmsUserSiteAccess.GetUserAccess(User.Id);
                }
                return access;
            }
        }
    }
}