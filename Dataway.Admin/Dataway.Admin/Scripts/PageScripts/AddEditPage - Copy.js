var containerTemplateId = 0;
var containerItemId = 0;
var componentId = 0;

$(document).ready(function () {
    $("#components input").change(function () {
        updateXml();
    });

    $("form").submit(function () {
        if (validationPage()) {
            updateXml();
            return true;
        }
        return false;
    });

    updateFriendlyUrlSuggestions();

    // Click the background hide popup elements
    $(document).mouseup(function (e) {
        var container = $("#FriendlyUrlOptions");
        if (container.has(e.target).length === 0) {
            container.hide();
        }
    });

    $(".suggest-change").change(function () {
        updateFriendlyUrlSuggestions();
    });

    $("#SuggestUrl").click(function (e) {
        $("#FriendlyUrlOptions").show();
    });

    $(document).on("click", "#FriendlyUrlOptions li", function () {
        $("#FriendlyUrl").val($(this).text());
        $("#FriendlyUrlOptions").hide();
    });

    $(document).on("change", ".component input", function () {
        updateXml();
    });

    $(document).on("click", ".container-item-remove", function () {
        $(this).closest(".item").remove();
    });

    $(document).on("click", ".container-item-collapse", function () {
        $(this).closest(".item").find(".template-components").first().slideUp(200);
        $(this).hide();
        $(this).parent().find(".container-item-expand").first().show();

        updateUserSettings();
    });

    $(document).on("click", ".container-item-expand", function () {
        $(this).closest(".item").find(".template-components").first().slideDown(200, function () {
            layout.resizeFix();
        });
        $(this).hide();
        $(this).parent().find(".container-item-collapse").first().show();

        //alert("...");

        updateUserSettings();
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
        populatePickedAsset(guiComponent, assetId);
    });



    $(document).on("click", "a.addChild", function () {

        var id = $(this).attr("id").split("_")[1];
        template = $(this).closest(".component").find(".template:first").clone();

        template = $("#template_" + id);
        //template.find(".name").attr("for", "item_" + containerItemId);

        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //!!!!!                                         !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //!!!!!    template.removeClass("template");    !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //!!!!!                                         !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

        // Need to append template.html() because appending template adds an extra div
        $(this).closest(".component").find(".content:first").append("<div class=\"item\" id=\"item_" + containerItemId + "\">" + template.html() + "</div>");

        $(this).closest(".component").attr("id", getNextComponentId());
        $(this).closest(".component").find(".component").each(function () {
            $(this).attr("id", getNextComponentId());
        });

        //$('html, body').animate({
        //    scrollTop: $("#item_" + containerItemId).offset().top
        //}, 500);

        $("#item_" + containerItemId).find("input").focus();

        var onPageElem = $("#item_" + containerItemId);
        console.log("Go!");
        onPageElem.find(".template-components:first > .component").each(function () {
            var typeStr = "";
            var classes = $(this).attr("class").split(" ");
            for (var i = 0; i < classes.length; i++) {
                if (classes[i].indexOf("type_") == 0) {
                    typeStr = classes[i].split("_")[1];
                    break;
                }
            }
            instanciateType(typeStr, $(this));
        });
        //----

        containerItemId++;

        //template.slideDown(200);
    });

    generateUiFromXml();

    // Populate
    populateTemplate();

    //$(".display_wysiwyg").htmlarea();

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
        $(this).attr("id", getNextComponentId());
    });
});

var componentIndex = 0;

function instanciateType(type, componentElm) {
    switch (type) {
        case "html":
            componentElm.find(".value").tinymce({
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
                template_replace_values: {
                    username: "Some User",
                    staffid: "991234"
                }
            });
            break;
        case "text":
            componentElm.find(".value.display_wysiwyg").tinymce({
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
                template_replace_values: {
                    username: "Some User",
                    staffid: "991234"
                }
            });
            break;
    }
}

function generateUiFromXml() {
    var xml = $("#TemplateXml").val();
    parser = new DOMParser();
    xmlDoc = parser.parseFromString(xml, "text/xml");
    //getUiFromXmlElement(xmlDoc.childNodes[0], $("#template"));
    var outerNode = xmlDoc.childNodes[0];
    getUiFromElement(outerNode, $("#components"));
}

function updateFriendlyUrlSuggestions() {
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
            //alert("Fail! ???" + valId);
        }
    });
}

// Building GUI without values, included container templates
function getUiFromElement(outerNode, contentContainer) {
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
                newComponent.find(".value").attr("id", key + "_" + componentIndex);
                newComponent.find(".value:not(.display_" + display + ")").remove();

                if (newComponent.find(".value").hasClass("display_wysiwyg")) {
                    //alert("GO!");

                    //		            newComponent.find(".value").htmlarea();
                    console.log("WYSIWYG : " + componentIndex);
                    isWysiwyg = true;
                    //newComponent.find(".value").jqte();
                }

                break;
            case "link":
                break;
            case "bool":
                break;
                //case "html":
                //    break;
            case "image":
                var hasCropper = false;

                //alert("c = " +componentNode.attributes.getNamedItem("hasCropper")
                if (componentNode.attributes.getNamedItem("hasCropper") != null && componentNode.attributes.getNamedItem("hasCropper").nodeValue == "true") {
                    //componentNode.attributes.getNamedItem("hasCropper").nodeValue;

                }
                else {
                    newComponent.find(".crop-image").remove();
                }
                break;
            case "container":
                newComponent.find(".addChild").attr("id", "addChild_" + containerTemplateId);
                newComponent.find(".template").attr("id", "template_" + containerTemplateId);
                containerTemplateId++;
                //getUiFromElement(componentNode, newComponent.find(".template"));

                getUiFromElement(componentNode, newComponent.find(".template").first().find(".template-components").first());
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

        componentIndex++;
        //contentContainer.find(".template-compoents").append(newComponent);



        contentContainer.append(newComponent);

        if (isWysiwyg) {
            //newComponent.find(".value").jqte();
            console.log("fhgfhf");

            //contentContainer.find("#component_" + )
        }
    }
}

function getSuggestedFriendlyUrl() {
    return "..."
}

function populateTemplate() {
    var xml = $("#ContentXml").val();
    parser = new DOMParser();
    xmlDoc = parser.parseFromString(xml, "text/xml");
    var outerNode = xmlDoc.childNodes[0];

    uniqueComponentIndex = 0;
    populateTemplateElement(outerNode, $("#components"));
}

var uniqueComponentIndex = 0;

function populateTemplateElement(outerNode, containerElement) {
    for (var i = 0; i < outerNode.childNodes.length; i++) {
        uniqueComponentIndex++;

        // current xml component
        var componentNode = outerNode.childNodes[i];

        var key = componentNode.attributes.getNamedItem("key").nodeValue;
        var type = "";

        //alert("key = " + key);

        var guiComponent = containerElement.find(".component.key_" + key + ":first");

        // There is components for the value
        if (guiComponent != undefined) {

            //alert("guiComponent = " + guiComponent.attr("class"));

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
                        //guiComponent.find(".value:first").val(componentNode.xml + "!!!");

                        var wrap = document.createElement('div');
                        wrap.appendChild(componentNode.cloneNode(true));

                        var wrap2 = document.createElement('div');
                        wrap2.appendChild(componentNode.cloneNode(false));

                        var start = wrap2.innerHTML.split("><")[0] + ">";
                        var end = "<" + wrap2.innerHTML.split("><")[1];

                        var html = wrap.innerHTML.replace(start, "").replace(end, "");
                        //alert("HTML = " + html);

                        var textareaVal = guiComponent.find(".value:first");

                        textareaVal.val(html);

                        //alert("HTML! " + key);


                        //------------------------

                        console.log("Make editor...");
                        console.log("Did I get here?");




                        //------------------------
                        break;
                    case "text":
                        guiComponent.find(".value:first").val(componentNode.textContent);

                        if (guiComponent.find(".value:first").hasClass("display_wysiwyg")) {
                            console.log("populateing editor : " + componentNode.textContent);


                            console.log("html = " + outerNode)
                            //guiComponent.find(".value").jqte();

                        }
                        break;
                    case "link":
                        //guiComponent.find(".value:first").val("");

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
                                populatePickedAsset(guiComponent, componentNode.textContent);
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

                        //guiComponent.find("." + linkType + "-options").find(".value").val(componentNode.textContent);
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

                        var valId = "ImageId" + key + uniqueComponentIndex;
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
                                    //contextedComponent.find(".image-thumb").attr("style", "background-image:url(/asset-thumb/" + data.Id + "?dm=" + data.DateModifiedTicks + ")");
                                    contextedComponent.find(".image-thumb").attr("style", "background-image:url(/asset-thumb/" + data.Id + "?w=80&h=80&c=t&dm=" + data.DateModifiedTicks + ")");
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
                            var itemId = "item_" + containerItemId;
                            containerItemId++;
                            guiComponent.find(".content:first").append("<div class=\"item\" id=\"" + itemId + "\">" + template.html() + "</div>");


                            //alert("open(" + containerItemId + ") == " + $("#Collapsed_" + containerItemId).val() + $("#" + itemId).html());


                            //alert(containerItemId + " is open = " + $("#Collapsed_" + containerItemId).val());


                            var itemElement = guiComponent.find($("#" + itemId));


                            if ($("#Collapsed_" + containerItemId).val() == "false") {
                                itemElement.find(".template-components").first().hide();
                                itemElement.find(".container-item-collapse").first().hide();
                                itemElement.find(".container-item-expand").first().show();
                            }
                            else {
                                itemElement.find(".template-components").first().show();
                                itemElement.find(".container-item-collapse").first().show();
                                itemElement.find(".container-item-expand").first().hide();
                                //$("#" + itemId).find(".template-components > header > .container-item-expand").first().hide();
                            }

                            populateTemplateElement(componentNode.childNodes[j], guiComponent.find($("#" + itemId)));
                        }

                        break;
                }

                instanciateType(type, guiComponent);
            }
        }
    }
}

function getNextComponentId() {
    componentId++;
    return "component_" + componentId;
}

function updateXml() {
    var xml = "<CmsPage>";
    xml += getXmlFromComponents($("#components").children(".component"));
    xml += "</CmsPage>";
    $("#xml").val(xml);
}

function getXmlFromComponents(components) {
    var xml = "";
    components.each(function () {
        var component = $(this);
        xml += getXmlFromComponent(component);
    });
    return xml;
}

function getXmlFromComponent(component) {
    var xml = "";
    var key = component.find(".key").val();
    var type = component.find(".type").val();
    var value = component.find(".value").val();

    //alert("key = " + key + " ::: " + value + "(" + type + ")");

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

            //alert("link type = " + linkType + ", v = " + text);

            xml += "<Component type=\"" + type + "\" key=\"" + key + "\" target=\"" + component.find(".target").val() + "\" linktype=\"" + linkType + "\">" + text + "</Component>";
            break;
        case "image":
            xml += "<Component type=\"" + type + "\" key=\"" + key + "\" crop=\"" + component.find(".crop").val() + "\">" + component.find(".asset-value").val() + "</Component>";
            break;
        case "container":
            xml += "<Component type=\"" + type + "\" key=\"" + key + "\">";
            component.find(".content:first").children(".item").each(function () {
                xml += "<Item>" + getXmlFromComponents($(this).find(".template-components").first().children(".component")) + "</Item>";
            });
            xml += "</Component>";
            break;
            //case "html":
            //    alert("GET Html value!");
            //    //var component.find("textarea").tinymce().getContent();
            //    break;
        default:
            xml += "<Component type=\"" + type + "\" key=\"" + key + "\">" + value + "</Component>";
    }

    return xml;
}

function populatePickedAsset(guiComponent, assetId) {
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
}

function validationPage() {
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
        var componentId = guiComponent.attr("id");

        //alert("id = " + componentId);
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

            $("#ErrorSummary").append("<a href=\"#" + componentId + "\">'" + name + "' is a required field</a>");
        }
    });

    $("#ErrorSummary").hide();
    if (!isValid) {
        $("#ErrorSummary").show();
    }
    //alert("VALIDATE! " + isValid);
    return isValid;
}

function updateUserSettings() {
    var index = 0;
    var array = "";

    $(".item").each(function () {
        var item = $(this);

        //alert("item index = " + item.attr("id").split("_")[1]);

        var isCollapsed = item.find(".container-item-collapse").first().attr("style") == "display: none;";
        //var isVisible = $(this).find(".container-item-collapse").first().is(":visible");
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

    layout.resizeFix();
}