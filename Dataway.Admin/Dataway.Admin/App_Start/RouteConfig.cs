using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace Dataway.Admin
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute("Home", "", new { controller = "Home", action = "Home" });
            routes.MapRoute("Login", "login", new { controller = "Login", action = "Login" });
            routes.MapRoute("Logout", "logout", new { controller = "Login", action = "Logout" });

            routes.MapRoute("Set Page Expand", "user-settings/set-page-expand", new { controller = "Login", action = "SetPageExpand" });
            routes.MapRoute("Collapsed Items", "user-settings/set-collapsed-items", new { controller = "Login", action = "SetCollapsedItems" });

            routes.MapRoute("Settings", "settings", new { controller = "Settings", action = "Settings" });

            routes.MapRoute("Set Site", "set-site", new { controller = "Layout", action = "SetSite" });

            routes.MapRoute("Get Asset", "asset/{assetId}", new { controller = "Assets", action = "GetAsset" });
            routes.MapRoute("Assets", "assets/{categoryId}", new { controller = "Assets", action = "List", categoryId = UrlParameter.Optional });

            routes.MapRoute("Search", "search", new { controller = "Search", action = "Search" });
            routes.MapRoute("Reindex Search", "reindex-search", new { controller = "Search", action = "ReindexSearh" });

            routes.MapRoute("Assets Categories", "asset-categories", new { controller = "Assets", action = "AssetCategoryList" });
            routes.MapRoute("Delete Assets Category", "delete-asset-category", new { controller = "Assets", action = "DeleteAssetCategory" });

            routes.MapRoute("Get Filtered Assets", "filtered-assets", new { controller = "Assets", action = "GetAssets" });
            routes.MapRoute("Asset Thumb", "asset-thumb/{assetId}", new { controller = "Assets", action = "GetAssetImageThumb" });
            routes.MapRoute("Get Asset Categories", "get-asset-categories", new { controller = "Assets", action = "GetAssetCategories" });

            routes.MapRoute("Get Asset Details", "asset-details/{assetId}", new { controller = "Assets", action = "GetAssetDetails" });
            routes.MapRoute("Get Asset Pages", "asset-pages/{assetId}", new { controller = "Assets", action = "GetAssetPages" });
            routes.MapRoute("Add Assets", "add-asset", new { controller = "Assets", action = "AddAsset" });
            routes.MapRoute("Delete Assets", "delete-asset", new { controller = "Assets", action = "DeleteAsset" });
            routes.MapRoute("Image Asset", "image/{assetId}", new { controller = "Assets", action = "GetAssetImage", assetId = UrlParameter.Optional });
            routes.MapRoute("Edit Asset", "asset-edit/{assetId}", new { controller = "Assets", action = "AddEdit" });

            routes.MapRoute("Users", "users", new { controller = "Users", action = "List" });
            routes.MapRoute("Add User", "user/{userId}", new { controller = "Users", action = "AddEdit" });

            routes.MapRoute("Sites", "sites", new { controller = "Site", action = "List" });
            routes.MapRoute("Site", "site/{siteId}", new { controller = "Site", action = "AddEdit" });

            routes.MapRoute("Pages", "pages", new { controller = "Pages", action = "List" });
            routes.MapRoute("Delete Page", "page/delete", new { controller = "Pages", action = "Delete" });
            routes.MapRoute("Set Page Active", "page/set-active", new { controller = "Pages", action = "SetActive" });
            routes.MapRoute("Suggested Friendly Urls", "page/suggested-urls", new { controller = "Pages", action = "GetSuggestedFriendlyUrls" });
            routes.MapRoute("Page", "page/{id}", new { controller = "Pages", action = "AddEdit", id = UrlParameter.Optional });
            routes.MapRoute("New Page", "page/new", new { controller = "Pages", action = "AddEdit" });

            routes.MapRoute("Page Templates", "page-templates", new { controller = "PageTemplates", action = "List" });
            routes.MapRoute("Page Template Delete", "page-template/delete", new { controller = "PageTemplates", action = "Delete", id = UrlParameter.Optional });
            routes.MapRoute("Page Template", "page-template/{id}", new { controller = "PageTemplates", action = "AddEdit", id = UrlParameter.Optional });
            routes.MapRoute("Reorder pages", "reorder-pages", new { controller = "Pages", action = "ReorderPages" });

            routes.MapRoute("Default", "{controller}/{action}/{id}", new { controller = "Home", action = "Index", id = UrlParameter.Optional });
        }
    }
}