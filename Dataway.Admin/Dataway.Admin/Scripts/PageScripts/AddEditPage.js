var addEditPage = {

    containerTemplateId: 0,
    containerItemId: 0,
    componentId: 0,
    componentIndex: 0,
    uniqueComponentIndex: 0,

    init: function () {

        $("#components input").change(function () {
            addEditPage.updateXml();
        });


        $("#WriteXml").on("click", function () {
            addEditPage.updateXml();
        });

        $("form").submit(function () {
            if (addEditPage.validationPage()) {
                addEditPage.updateXml();
                return true;
            }
            return false;
        });

        addEditPage.updateFriendlyUrlSuggestions();

        // Click the background hide popup elements
        $(document).mouseup(function (e) {
            var container = $("#FriendlyUrlOptions");
            if (container.has(e.target).length === 0) {
                container.hide();
            }
        });

        $(".suggest-change").change(function () {
            addEditPage.updateFriendlyUrlSuggestions();
        });

        $("#SuggestUrl").click(function (e) {
            $("#FriendlyUrlOptions").show();
        });

        $(document).on("click", "#FriendlyUrlOptions li", function () {
            $("#FriendlyUrl").val($(this).text());
            $("#FriendlyUrlOptions").hide();
        });

        $(document).on("change", ".component input", function () {
            addEditPage.updateXml();
        });

        $(document).on("click", ".container-item-remove", function () {
            $(this).closest(".item").remove();
        });

        $(document).on("click", ".container-item-collapse", function () {
            $(this).closest(".item").find(".template-components").first().slideUp(200);
            $(this).hide();
            $(this).parent().find(".container-item-expand").first().show();

            addEditPage.updateUserSettings();
        });

        $(document).on("click", ".container-item-expand", function () {
            $(this).closest(".item").find(".template-components").first().slideDown(200);
            $(this).hide();
            $(this).parent().find(".container-item-collapse").first().show();

            addEditPage.updateUserSettings();
        });


        $(document).on("click", ".container-item-up", function () {
            $(this).closest(".item").prev().before($(this).closest(".item"));
        });

        $(document).on("click", ".container-item-down", function () {
            $(this).closest(".item").next().after($(this).closest(".item"));
        });

        $(document).on("click", "#AssetSelectorOk", function () {
            var guiComponent = $("#" + $("#AssetSelectorField").val());
            var assetId = $("#AssetSelectorAssetId").val();
            addEditPage.populatePickedAsset(guiComponent, assetId);
        });

        $(document).on("click", "a.addChild", function () {

            var id = $(this).attr("id").split("_")[1];
            template = $(this).closest(".component").find(".template:first").clone();

            template = $("#template_" + id);

            // Need to append template.html() because appending template adds an extra div
            $(this).closest(".component").find(".content:first").append("<div class=\"item\" id=\"item_" + addEditPage.containerItemId + "\">" + template.html() + "</div>");

            $(this).closest(".component").attr("id", addEditPage.getNextComponentId());
            $(this).closest(".component").find(".component").each(function () {
                $(this).attr("id", addEditPage.getNextComponentId());


            });

            $("#item_" + addEditPage.containerItemId).find("input").focus();

            var onPageElem = $("#item_" + addEditPage.containerItemId);
            //console.log("Go!");

            onPageElem.find(".template-components:first > .component").each(function () {
                var typeStr = "";
                var classes = $(this).attr("class").split(" ");
                for (var i = 0; i < classes.length; i++) {
                    if (classes[i].indexOf("type_") == 0) {
                        typeStr = classes[i].split("_")[1];
                        break;
                    }
                }

                //console.log("Instanciate: " + typeStr);
                addEditPage.instanciateType(typeStr, $(this));
            });

            addEditPage.containerItemId++;
        });

        addEditPage.generateUiFromXml();

        // Populate
        addEditPage.populateTemplate();

        $(document).on("change", ".link-type", function () {
            var component = $(this).closest(".component");
            component.find(".external-options").hide();
            component.find(".asset-options").hide();
            component.find(".page-options").hide();
            component.find(".email-options").hide();

            var linkType = $(this).val();

            if (linkType == "email") {
                component.find(".target").hide();
            }
            else {
                component.find(".target").show();
            }

            if (component.find(".asset-value").val() == "") {
                component.find(".asset-detail").hide();
            }

            component.find("." + linkType + "-options").show();
        });

        // Give all components a unique ID
        var currentComponentId = 0;
        $(".component").each(function () {
            $(this).attr("id", addEditPage.getNextComponentId());
        });
    },

    instanciateType: function (type, componentElm) {
        if (componentElm.closest(".template").length == 0) {
            switch (type) {
                case "text":
                    //console.log("initialise it!");

                    var thingToChange = componentElm.find(".value.display_wysiwyg");
                    //thingToChange.css("background-color", "#f00");

                    //var hasEditor = componentElm.find(".value.display_wysiwyg").length == 1;

                    if (thingToChange.attr("data-been-initialised") != "true") {

                        //console.log("Not a template - Let's initialise this " + type + "!");

                        thingToChange.tinymce({
                            script_url: '/Scripts/tinymce/tinymce.min.js',
                            theme: "modern",
                            skin: "light",
                            plugins: "table,code,pagebreak,layer,table,save,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,template",
                            toolbar: "code,|,undo,redo,|,cut,copy,paste,|,bold,italic,underline,|,alignleft,aligncenter,alignright,|,bullist,numlist,link,image,table",
                            theme_advanced_toolbar_location: "top",
                            theme_advanced_toolbar_align: "left",
                            theme_advanced_statusbar_location: "bottom",
                            theme_advanced_resizing: false,
                            menubar: false,
                            template_external_list_url: "lists/template_list.js",
                            external_link_list_url: "lists/link_list.js",
                            external_image_list_url: "lists/image_list.js",
                            media_external_list_url: "lists/media_list.js",
                            //template_replace_values: {
                            //    username: "Some User",
                            //    staffid: "991234"
                            //}
                        });

                        thingToChange.attr("data-been-initialised", "true");
                    }
                    else {
                        //console.log("This has already been processed.");
                    }
                    break;
            }
        }
        else {
            //console.log("This is a template");
        }
    },

    generateUiFromXml: function () {
        var xml = $("#TemplateXml").val();
        parser = new DOMParser();
        var xmlDoc = parser.parseFromString(xml, "text/xml");
        var outerNode = xmlDoc.childNodes[0];
        addEditPage.getUiFromElement(outerNode, $("#components"));
    },

    updateFriendlyUrlSuggestions: function () {
        $("#FriendlyUrlOptions").html("");
        $("#FriendlyUrlOptions").append("<li class=\"loading\"><span>Loading...</span></li>");

        $.ajax({
            type: "POST",
            url: "/page/suggested-urls",
            data: { Name: $("#Name").val(), ParentId: $("#ParentId").val() },
            success: function (data) {
                $("#FriendlyUrlOptions").html("");
                for (var i = 0; i < data.length; i++) {
                    $("#FriendlyUrlOptions").append("<li>" + data[i] + "</li>");
                }
            },
            error: function () {
            }
        });
    },

    // Building GUI without values, included container templates
    getUiFromElement: function (outerNode, contentContainer) {
        for (var i = 0; i < outerNode.childNodes.length; i++) {
            var componentNode = outerNode.childNodes[i];
            var newComponent = null;

            var name = componentNode.attributes.getNamedItem("name").nodeValue;
            var description = componentNode.attributes.getNamedItem("description").nodeValue;
            var key = componentNode.attributes.getNamedItem("key").nodeValue;
            var type = componentNode.attributes.getNamedItem("type").nodeValue;

            var required = false;
            if (componentNode.attributes.getNamedItem("required") != undefined) {
                required = componentNode.attributes.getNamedItem("required").nodeValue == "true";
            }

            var elementText = componentNode.contentText;
            var newComponent = $("#" + type + "_template").clone();

            var isWysiwyg = false;
            switch (type) {
                case "text":
                    var display = componentNode.attributes.getNamedItem("display").nodeValue;
                    //newComponent.find(".value").attr("id", key + "_" + addEditPage.componentIndex);
                    newComponent.find(".value:not(.display_" + display + ")").remove();
                    if (newComponent.find(".value").hasClass("display_wysiwyg")) {
                        //console.log("WYSIWYG : " + addEditPage.componentIndex);
                        isWysiwyg = true;
                    }
                    break;
                case "link":
                    break;
                case "bool":
                    break;
                case "image":
                    var hasCropper = false;
                    var cropperAttr = componentNode.attributes.getNamedItem("has-cropper");
                    if (cropperAttr == null || cropperAttr.nodeValue != "true") {
                        newComponent.find(".crop-image").remove();
                    }
                    break;
                case "container":
                    newComponent.find(".addChild").attr("id", "addChild_" + addEditPage.containerTemplateId);
                    newComponent.find(".template").attr("id", "template_" + addEditPage.containerTemplateId);
                    addEditPage.containerTemplateId++;
                    addEditPage.getUiFromElement(componentNode, newComponent.find(".template").first().find(".template-components").first());
                    break;
                default:
                    break;
            }

            newComponent.find(".name").first().text(name);
            newComponent.find(".description").first().text(description);
            newComponent.find(".key").first().val(key);

            newComponent.removeAttr("id");
            newComponent.addClass("key_" + key);
            newComponent.addClass("type_" + type);

            if (required) {
                newComponent.addClass("required");
            }

            addEditPage.componentIndex++;

            contentContainer.append(newComponent);

            addEditPage.instanciateType(type, newComponent);
        }
    },

    getSuggestedFriendlyUrl: function () {
        return "..."
    },

    populateTemplate: function () {
        var xml = $("#ContentXml").val();
        parser = new DOMParser();
        xmlDoc = parser.parseFromString(xml, "text/xml");
        var outerNode = xmlDoc.childNodes[0];


        addEditPage.uniqueComponentIndex = 0;
        addEditPage.populateTemplateElement(outerNode, $("#components"));
    },

    populateTemplateElement: function (outerNode, containerElement) {
        for (var i = 0; i < outerNode.childNodes.length; i++) {
            addEditPage.uniqueComponentIndex++;

            // current xml component
            var componentNode = outerNode.childNodes[i];

            var key = componentNode.attributes.getNamedItem("key").nodeValue;
            var type = "";

            var guiComponent = containerElement.find(".component.key_" + key + ":first");

            // There is components for the value
            if (guiComponent != undefined) {
                if (guiComponent.attr("class") != undefined) {
                    var classes = guiComponent.attr("class").split(" ");

                    // Get the type from the UI component class "type_[...]"
                    for (var j = 0; j < classes.length; j++) {
                        if (classes[j].split("_")[0] == "type") {
                            type = classes[j].split("_")[1];
                        }
                    }

                    switch (type) {
                        case "html":
                            var wrap = document.createElement('div');
                            wrap.appendChild(componentNode.cloneNode(true));
                            var wrap2 = document.createElement('div');
                            wrap2.appendChild(componentNode.cloneNode(false));
                            var start = wrap2.innerHTML.split("><")[0] + ">";
                            var end = "<" + wrap2.innerHTML.split("><")[1];
                            var html = wrap.innerHTML.replace(start, "").replace(end, "");
                            var textareaVal = guiComponent.find(".value:first");
                            textareaVal.val(html);
                            break;
                        case "text":
                            //console.log("I was a text!");
                            guiComponent.find(".value:first").val(componentNode.innerHTML);
                            //if (guiComponent.find(".value:first").hasClass("display_wysiwyg")) {
                            //    guiComponent.find(".value:first").val(componentNode.innerHTML);
                            //}
                            //else {
                            //    guiComponent.find(".value:first").val(addEditPage.htmlDecode(componentNode.innerHTML));
                            //}



                            break;
                        case "link":
                            var linkType = "";
                            if (componentNode.attributes.getNamedItem("linktype") != null) {
                                linkType = componentNode.attributes.getNamedItem("linktype").nodeValue;
                            }

                            if (componentNode.attributes.getNamedItem("linktype") != undefined) {
                                guiComponent.find(".link-type").val(linkType);
                            }

                            guiComponent.find(".external-options").hide();
                            guiComponent.find(".asset-options").hide();
                            guiComponent.find(".page-options").hide();
                            guiComponent.find(".email-options").hide();

                            switch (linkType) {
                                case "asset":
                                    guiComponent.find(".asset-value").val(componentNode.textContent);
                                    addEditPage.populatePickedAsset(guiComponent, componentNode.textContent);
                                    break;
                                case "external":
                                    guiComponent.find(".external-value").val(componentNode.textContent);
                                    break;
                                case "email":
                                    guiComponent.find(".target").hide();
                                    guiComponent.find(".email-value").val(componentNode.textContent);
                                    break;
                                case "page":
                                    guiComponent.find(".page-value").val(componentNode.textContent);
                                    break;
                            }

                            guiComponent.find("." + guiComponent.find(".link-type").val() + "-options").show();
                            guiComponent.find(".target:first").val(componentNode.attributes.getNamedItem("target").nodeValue);
                            break;
                        case "bool":
                            if (componentNode.textContent == "true") {
                                guiComponent.find(".value:first").attr("checked", "checked");
                            }
                            break;
                        case "image":
                            guiComponent.find(".asset-value:first").val(componentNode.textContent);

                            var valId = "ImageId" + key + addEditPage.uniqueComponentIndex;
                            guiComponent.find(".asset-value:first").attr("id", valId);
                            guiComponent.find(".image-thumb:first").attr("id", "thumb_" + valId);

                            guiComponent.find(".crop").val("");
                            if (componentNode.attributes.getNamedItem("crop") != null) {
                                guiComponent.find(".crop").val(componentNode.attributes.getNamedItem("crop").nodeValue);
                            }

                            if (componentNode.textContent != "") {
                                var contextedComponent = guiComponent;
                                $.ajax({
                                    type: "POST",
                                    url: "/asset-details/" + componentNode.textContent,
                                    success: function (data) {
                                        contextedComponent.find(".image-thumb").attr("style", "background-image:url(/asset-thumb/" + data.Id + "?w=200&h=200&c=t&dm=" + data.DateModifiedTicks + ")");
                                    },
                                    error: function () { alert("Fail! ???" + valId); }
                                });
                            } else {
                                guiComponent.find(".image-thumb:first").attr("style", "background-image:url(/Images/noImageThumb.png)");
                            }
                            guiComponent.find(".select-image:first").attr("id", "value_" + valId);
                            break;
                        case "container":
                            var template = guiComponent.find(".template:first");

                            for (var j = 0; j < componentNode.childNodes.length; j++) {
                                var itemId = "item_" + addEditPage.containerItemId;
                                addEditPage.containerItemId++;
                                guiComponent.find(".content:first").append("<div class=\"item\" id=\"" + itemId + "\">" + template.html() + "</div>");

                                var itemElement = guiComponent.find($("#" + itemId));

                                if ($("#Collapsed_" + addEditPage.containerItemId).val() == "false") {
                                    itemElement.find(".template-components").first().hide();
                                    itemElement.find(".container-item-collapse").first().hide();
                                    itemElement.find(".container-item-expand").first().show();
                                }
                                else {
                                    itemElement.find(".template-components").first().show();
                                    itemElement.find(".container-item-collapse").first().show();
                                    itemElement.find(".container-item-expand").first().hide();
                                }

                                addEditPage.populateTemplateElement(componentNode.childNodes[j], guiComponent.find($("#" + itemId)));
                            }

                            break;
                    }


                    addEditPage.instanciateType(type, guiComponent);
                }
            }
        }
    },

    getNextComponentId: function () {
        addEditPage.componentId++;
        return "component_" + addEditPage.componentId;
    },

    updateXml: function () {
        var xml = "<CmsPage>";
        xml += addEditPage.getXmlFromComponents($("#components").children(".component"));
        xml += "</CmsPage>";
        $("#xml").val(xml);
    },

    getXmlFromComponents: function (components) {
        var xml = "";
        components.each(function () {
            var component = $(this);
            xml += addEditPage.getXmlFromComponent(component);
        });
        return xml;
    },

    getXmlFromComponent: function (component) {
        var xml = "";
        var key = component.find(".key").val();
        var type = component.find(".type").val();
        var value = component.find(".value").val();

        if (component.find(".value").attr("type") == "checkbox") {
            value = (component.find(".value").attr('checked') == "checked");
        }

        switch (type) {
            case "link":
                var linkType = component.find(".link-type").val();

                var text = component.find("." + linkType + "-options").find(".value").val();

                switch (linkType) {
                    case "asset":
                        text = component.find(".asset-value").val();
                        break;
                    case "external":
                        text = component.find(".external-value").val();
                        break;
                    case "page":
                        text = component.find(".page-value").val();
                        break;
                    case "email":
                        text = component.find(".email-value").val();
                        break;
                }

                xml += "<Component type=\"" + type + "\" key=\"" + key + "\" target=\"" + component.find(".target").val() + "\" linktype=\"" + linkType + "\">" + text + "</Component>";
                break;
            case "image":
                xml += "<Component type=\"" + type + "\" key=\"" + key + "\" crop=\"" + component.find(".crop").val() + "\">" + component.find(".asset-value").val() + "</Component>";
                break;
            case "container":
                xml += "<Component type=\"" + type + "\" key=\"" + key + "\">";
                component.find(".content:first").children(".item").each(function () {
                    xml += "<Item>" + addEditPage.getXmlFromComponents($(this).find(".template-components").first().children(".component")) + "</Item>";
                });
                xml += "</Component>";
                break;
            case "text":
                xml += "<Component type=\"" + type + "\" key=\"" + key + "\"><![CDATA[" + value + "]]></Component>";
                break;
            default:
                //xml += "<Component type=\"" + type + "\" key=\"" + key + "\">" + addEditPage.htmlEncode(value) + "</Component>";
                xml += "<Component type=\"" + type + "\" key=\"" + key + "\">" + value + "</Component>";
        }

        return xml;
    },

    populatePickedAsset: function (guiComponent, assetId) {
        if (assetId == "") {
            guiComponent.find(".asset-detail").hide();
        }
        else {
            guiComponent.find(".asset-detail").show();
            $.ajax({
                type: "POST",
                url: "/asset-details/" + assetId,
                success: function (data) {
                    guiComponent.find(".asset-thumb").css("background-image", "url(/asset-thumb/" + data.Id + "?dm=" + data.DateModifiedTicks + ")");
                    guiComponent.find(".filename").text(data.Filename);
                },
                error: function () { alert("Could not find asset (" + assetId + ")"); }
            });
        }
    },

    validationPage: function () {
        var errorMessages = new Array();
        var isValid = true;
        $("#ErrorSummary").html("");

        if ($("#Name").val() == "") {
            isValid = false;
            $("#ErrorSummary").append("<a href=\"#Name\">You must provide a page name.</a>");
        }
        if ($("#CmsTemplatePageId").val() == "") {
            isValid = false;
            $("#ErrorSummary").append("<a href=\"#CmsTemplatePageId\">You must select a page template.</a>");
        }

        $(".required").each(function () {
            var guiComponent = $(this);
            var name = guiComponent.find(".name:first").text();
            var compId = guiComponent.attr("id");

            var componentIsValid = true;

            if (!guiComponent.parent().parent().hasClass("template")) {
                if (guiComponent.hasClass("type_text")) {
                    if (guiComponent.find(".value").val() == "") {
                        componentIsValid = false;
                    }
                }
                else if (guiComponent.hasClass("type_image")) {
                    if (guiComponent.find(".asset-value").val() == "") {
                        componentIsValid = false;
                    }
                }
                else if (guiComponent.hasClass("type_container")) {
                    if (guiComponent.find(".content .item .template-components").length == 0) {
                        componentIsValid = false;
                    }
                }
                else {
                }
            }

            if (!componentIsValid) {
                isValid = false;
                guiComponent.addClass("error");
                errorMessages.push("'" + name + "' is a required field.");

                $("#ErrorSummary").append("<a href=\"#" + compId + "\">'" + name + "' is a required field</a>");
            }
        });

        $("#ErrorSummary").hide();
        if (!isValid) {
            $("#ErrorSummary").show();
        }

        return isValid;
    },

    updateUserSettings: function () {
        var index = 0;
        var array = "";

        $(".item").each(function () {
            var item = $(this);
            var isCollapsed = item.find(".container-item-collapse").first().attr("style") == "display: none;";
            if (!isCollapsed) {
                array += "1";
            }
            else {
                array += "0";
            }
        });

        $.ajax({
            type: "POST",
            url: "/user-settings/set-collapsed-items",
            data: { PageId: $("#Id").val(), CollapsedItems: array },
            success: function (data) {

            },
            error: function () { alert("Fail!"); }
        });
    }

    //htmlEncode: function (value) {
    //    if (value) {
    //        return jQuery('<div />').text(value).html();
    //    } else {
    //        return '';
    //    }
    //},

    //htmlDecode: function (value) {
    //    if (value) {
    //        return $('<div />').html(value).text();
    //    } else {
    //        return '';
    //    }
    //}

};

$(document).ready(function () {
    addEditPage.init();
});