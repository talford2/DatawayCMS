using System;
using System.Linq;
using System.Web.Mvc;
using Dataway.Admin.Attributes;
using Dataway.Admin.ViewModels;
using Dataway.Cms;
using Dataway.Cms.Core;
using Dataway.ImageLibrary;
using Dataway.MvcLibrary.Helpers;
using Dataway.WebImaging;

namespace Dataway.Admin.Controllers
{
    public class AssetsController : Controller
    {
        [UserAccessAttribute(true, false, true)]
        public ActionResult List(int? categoryId)
        {
            var model = new AssetsViewModel();

            //model.Assets = Dataway.Caching.CacheHelper.GetCached<List<CmsAsset>>("Assets", 60, () =>
            //{
            //    return CmsAsset.GetAll();
            //});
            model.CategoryId = categoryId;

            model.Assets = CmsAsset.GetAll();
            model.Categories = CmsAssetCategory.GetList();
            model.SelectMenu = SelectedMenuItem.Assets;
            return View(model);
        }

        [UserAccessAttribute(true, false, true)]
        public ActionResult AddEdit(int? assetId)
        {
            var model = new AssetViewModel();
            model.SelectMenu = SelectedMenuItem.Assets;

            model.Categories = CmsAssetCategory.GetList();

            if (assetId.HasValue)
            {
                model.Asset = CmsAsset.GetAsset(assetId.Value);
            }
            else
            {
                model.Asset = new CmsAsset();
            }

            return View(model);
        }

        [HttpPost]
        [UserAccessAttribute(true, false, true)]
        public ActionResult AddEdit(FormCollection form)
        {
            var model = new AssetViewModel();
            if (form.Value<int>("Id") != 0)
            {
                model.Asset = CmsAsset.GetAsset(form.Value<int>("Id"));
            }
            model.Asset.Filename = form.Value<string>("Filename");
            model.Asset.CategoryId = form.Value<int?>("CategoryId");

            if (!string.IsNullOrEmpty(Request.Files["File"].FileName))
            {
                model.Asset.OriginalFilename = Request.Files["File"].FileName;
                string savePath = Request.MapPath("~" + model.Asset.GetUrlPath());
                Request.Files["File"].SaveAs(savePath);
            }

            model.Asset.Save();

            if (model.Asset.CategoryId.HasValue)
            {
                return Redirect("/assets#" + model.Asset.CategoryId.Value);
            }

            return Redirect("/assets");
            //return View(model);
        }

        [OutputCache(Duration = 8640000, VaryByParam = "dm", Location = System.Web.UI.OutputCacheLocation.Client)]
        public ActionResult GetAssetImageThumb(int assetId, int? w, int? h)
        {
            int width = 48;
            int height = 48;

            if (w.HasValue)
            {
                width = w.Value;
            }
            if (h.HasValue)
            {
                height = h.Value;
            }

            var asset = CmsAsset.GetAsset(assetId);

            if (asset != null)
            {
                if (asset.Type == "Image")
                {
                    return WebImagingController.GetProcessedImageResult(asset.GetUrlPath(), width, height, new ImageProcessingFullSettings { Quality = 90, ScratchUrl = "/AssetsDir/Dynamic", MissingImageUrl = "/Images/noImage.jpg", IsCropped = true, UseResampling = true });
                }
                else
                {
                    return WebImagingController.GetProcessedImageResult("/Images/FileTypes/" + asset.Type + ".png", width, height, new ImageProcessingFullSettings { Quality = 90, ScratchUrl = "/AssetsDir/Dynamic", MissingImageUrl = "/Images/FileTypes/Unknown.png", IsCropped = false, UseResampling = true });
                }

            }
            return new EmptyResult();
        }

        [OutputCache(Duration = 8640000, VaryByParam = "dm", Location = System.Web.UI.OutputCacheLocation.Client)]
        public ActionResult GetAssetImage(int assetId)
        {
            int width = 1000;
            int height = 1000;



            if (!string.IsNullOrWhiteSpace(Request["w"]))
            {
                width = int.Parse(Request["w"]);
            }
            if (!string.IsNullOrWhiteSpace(Request["h"]))
            {
                height = int.Parse(Request["h"]);
            }

            //int? blur = null;
            //if (!string.IsNullOrWhiteSpace(Request["b"]))
            //{
            //    blur = int.Parse(Request["b"]);
            //}

            ImageProcessingFullSettings settings = new ImageProcessingFullSettings();
            settings.UseResampling = true;
            settings.IsCropped = Request["c"] == "1";
            settings.IsGreyScale = Request["g"] == "1";

            if (!string.IsNullOrWhiteSpace(Request["q"]))
            {
                settings.Quality = int.Parse(Request["q"]);
            }

            settings.IsInverted = Request["i"] == "1";

            settings.CropPosition = CropPosition.Centre;
            switch (Request["cp"])
            {
                case "tl":
                    settings.CropPosition = CropPosition.TopLeft;
                    break;
                case "tc":
                    settings.CropPosition = CropPosition.TopCentre;
                    break;
            }


            if (!string.IsNullOrEmpty(Request["ccx"]))
            {
                settings.CustomCrop = new System.Drawing.Rectangle(int.Parse(Request["ccx"]), int.Parse(Request["ccy"]), int.Parse(Request["ccw"]), int.Parse(Request["cch"]));
            }

            var asset = CmsAsset.GetAsset(assetId);

            //return WebImagingController.GetProcessedImageResult(asset.GetUrlPath(), width, height, new ImageProcessingFullSettings { IsCropped = isCropped, Quality = quality, UseResampling = true, IsGreyScale = isGreyScale, IsInverted = invert, CropPosition = cropPos });
            return WebImagingController.GetProcessedImageResult(asset.GetUrlPath(), width, height, settings);
        }

        //[OutputCache(Duration = 8640000, VaryByParam = "dm", Location = System.Web.UI.OutputCacheLocation.Client)]
        public ActionResult GetAsset(int assetId)
        {
            var asset = CmsAsset.GetAsset(assetId);
            string filename = Request.MapPath("~/" + asset.GetUrlPath());
            return File(filename, asset.Mime);
        }

        public ActionResult GetAssetDetails(int assetId)
        {
            //return Json(CmsAsset.GetAsset(assetId));
            var asset = CmsAsset.GetAsset(assetId);

            if (asset == null)
            {
                return null;
            }

            int? width = null;
            int? height = null;

            if (asset is CmsImageAsset)
            {
                var typed = asset as CmsImageAsset;
                width = typed.Width;
                height = typed.Height;
            }

            return Json(new { Id = asset.Id, Type = asset.Type, Width = width, Height = height, Filename = asset.Filename, DateModifiedTicks = asset.DateLastModified.Ticks.ToString().Substring(0, 14), CategoryId = asset.CategoryId });
        }

        public ActionResult GetAssetPages(int assetId)
        {
            return Json(CmsAsset.GetPagesUsingAsset(assetId, CmsCommon.CurrentSite.Id));
        }

        [OutputCache(Duration = 120000, VaryByParam = "none", Location = System.Web.UI.OutputCacheLocation.Client)]
        public ActionResult GetAssetCategories()
        {
            return Json(CmsAssetCategory.GetList());
        }

        [UserAccessAttribute(true, false, true)]
        public ActionResult AssetCategoryList()
        {
            var model = new AssetCategoryListViewModel();
            model.SelectMenu = SelectedMenuItem.AssetCategories;
            model.Categories = CmsAssetCategory.GetList();
            return View(model);
        }

        [HttpPost]
        public ActionResult AssetCategoryList(string name)
        {
            CmsAssetCategory category = new CmsAssetCategory();
            category.Name = name;
            category.Save();
            return Redirect("/asset-categories");
        }

        public ActionResult GetAssets(bool imagesOnly, int? categoryId, string keywords)
        {
            Common.LoggedInUser.Settings.AssetFilterKeywords = keywords;

            var assets = CmsAsset.GetFilteredList(categoryId, keywords, imagesOnly);
            if (imagesOnly)
            {
                assets = assets.Where(a => a.Type.ToLower() == "image").ToList();
            }

            //return Json(assets);
            return Json(assets.Select(a => new
            {
                Id = a.Id,
                Fn = a.Filename,
                Fs = a.FriendlyFileSize,
                T = a.Type,
                Dc = a.DateCreated.ToString("d MMM yyyy h:mm tt"),
                //DateLastModified = a.DateLastModified.Ticks.ToString().Substring(4, 10)
                Dm = a.DateLastModified.Ticks.ToString().Substring(4, 10)
            }));


            //List<CmsAsset> assets = null;

            //if (imagesOnly)
            //{
            //    assets = CmsAsset.GetAll().Where(a => a.Type.ToLower() == "image").ToList();
            //    //return Json();
            //}
            //else
            //{
            //    assets = CmsAsset.GetAll();
            //}

            //return Json(assets.Select(a => new { Id = a.Id, DateModifiedTicks = a.DateLastModified.Ticks.ToString().Substring(0, 14), Filename = a.Filename }));
        }

        //[UserAccessAttribute(true, false, true)]
        public ActionResult AddAsset(FormCollection form)
        {
            CmsAsset newAsset = new CmsAsset();

            newAsset.Filename = Request.Files["File"].FileName;
            newAsset.OriginalFilename = newAsset.Filename;
            newAsset.Extension = Request.Files["File"].FileName.Split('.')[1].ToLower();
            newAsset.CategoryId = form.Value<int?>("AssetCategoryId");


            //string imgExtensions = "jpg,jpeg,png,gif";
            //if (imgExtensions.Split(',').Contains(newAsset.Extension.ToLower()))
            //{
            //    newAsset.CmsAssetTypeId = 3;
            //}

            newAsset.CmsAssetTypeId = CmsAssetType.GetTypeFromExtension(newAsset.Extension).Id;
            newAsset.Save();

            string savePath = Request.MapPath("~" + newAsset.GetUrlPath());
            Request.Files[0].SaveAs(savePath);

            if (newAsset.CategoryId.HasValue)
            {
                return Redirect("/assets/" + newAsset.CategoryId.Value);
            }

            return Redirect("/assets");
        }

        [UserAccessAttribute(true, false, false)]
        public ActionResult DeleteAsset(int id)
        {
            CmsAsset.DeleteAssest(id);
            return new EmptyResult();
        }

        [UserAccessAttribute(true, false, false)]
        public ActionResult DeleteAssetCategory(int id)
        {
            CmsAssetCategory.Delete(id);
            return new EmptyResult();
        }
    }
}
