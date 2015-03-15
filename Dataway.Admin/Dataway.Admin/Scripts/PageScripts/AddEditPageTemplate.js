$(document).ready(function () {
    $("#component_menu li a").click(function () {
        var type = $(this).attr("id").split("_")[1];

        var templateComponent = $("#component_" + type);

        if (templateComponent.length == 0) {
            templateComponent = $("#component_generic");
            templateComponent.find(".component-heading").text(generateKey(type));
            templateComponent.find(".type").val(type);
        }

        var newComponent = templateComponent.clone();
        newComponent.removeAttr("id");

        newComponent.find(".name").val("");
        newComponent.find(".key").val("");
        newComponent.find(".description").val("");
        newComponent.find(".required").val("");

        $("#template").append(newComponent);

        newComponent.hide();
        newComponent.slideDown(200);
        updateXml();
    });

    //alert("??");
    //$(document).on("click", ".up", function () {
    //    alert("Move up");
    //});

    //$(document).on("click", ".down", function () {
    //    alert("Move down");
    //});

    $(document).on("click", ".up", function () {
        $(this).closest(".component").prev().before($(this).closest(".component"));
    });

    $(document).on("click", ".down", function () {
        $(this).closest(".component").next().after($(this).closest(".component"));
    });


    //--------------
    $("form").submit(function () {
        updateXml();
    });

    $(document).on("click", ".component .delete", function () {
        //alert("delete!");

        if (confirm("Are you sure you want to delete this item?")) {
            var self = $(this);
            self.fadeOut(200);
            self.closest(".component").slideUp(200, function () {
                $(this).remove();
                updateXml();
            });
        }
    });

    $(document).on("change", ".component .name", function () {
        var self = $(this);
        var component = self.closest(".component");

        var keyField = component.find(".key")
        if (keyField.val() == "") {
            keyField.val(generateKey(self.val()));
        }
    });

    $(document).on("click", ".container_add_items li a", function () {
        var self = $(this);
        var type = self.attr("class").split("_")[1];
        var componentTemplate = $("#component_" + type);

        if (componentTemplate.length == 0) {
            componentTemplate = $("#component_generic");
        }
        var component = componentTemplate.clone();

        component.find(".type").val(type);
        component.find(".component-heading").text(generateKey(type));

        self.closest(".component").find(".container_content:first").append(component);
    });

    $(document).on("change", ".component input, .component textarea", function () {
        updateXml();
    });

    $(document).on("click", ".component-heading", function () {
        //alert("hide/show");

        if ($(this).parent().find("div").first().is(":visible")) {
            $(this).parent().find("div").first().slideUp(200);
        }
        else {
            $(this).parent().find("div").first().slideDown(200);
        }
    });

    generateUiFromXml();

    $("#template").sortable({
        placeholder: "blank",
        item: "#template > div.component",
        handle: "> h4",
        opacity: 0.6,
        distance: 10
    });
});

function generateUiFromXml() {
    var xml = $("#xml").val();

    if (window.DOMParser) {
        parser = new DOMParser();
        xmlDoc = parser.parseFromString(xml, "text/xml");
        getUiFromXmlElement(xmlDoc.childNodes[0], $("#template"));
    }
    else {
        alert("nah!!!!");
    }
}

var depth = 0;
var itemsAdded = 0;

function getUiFromXmlElement(outerNode, element) {
    depth++;

    for (var i = 0; i < outerNode.childNodes.length; i++) {
        var componentNode = outerNode.childNodes[i];
        var type = componentNode.attributes.getNamedItem("type").nodeValue;

        //alert("Type = " + type);
        var name = componentNode.attributes.getNamedItem("name").nodeValue;
        var key = componentNode.attributes.getNamedItem("key").nodeValue;
        var description = componentNode.attributes.getNamedItem("description").nodeValue;
        var required = false;

        if (componentNode.attributes.getNamedItem("required") != undefined) {
            required = componentNode.attributes.getNamedItem("required").nodeValue == "true";
        }

        var newComponent = null;

        var compType = componentNode.attributes.getNamedItem("type").nodeValue
        switch (compType) {
            case "container":
                newComponent = getGenericComponent(name, key, description, type, required, "component_container");
                var containerContentElement = newComponent.find(".container_content").first();
                containerContentElement.append(getUiFromXmlElement(componentNode, containerContentElement));
                break;
            default:
                console.log("key = " + key)
                newComponent = getGenericComponent(name, key, description, type, required, "component_" + compType);

                // no template, use generic
                if (newComponent.length == 0) {
                    newComponent = getGenericComponent(name, key, description, type, required, "component_generic");
                }

                // loop through xml attributes
                for (var j = 0; j < componentNode.attributes.length; j++) {
                    var xmlAttr = componentNode.attributes[j];
                    //console.log(xmlAttr.name + " = " + xmlAttr.nodeValue);

                    var inputElement = newComponent.find("[data-xml-store='" + xmlAttr.name + "']").first();

                    if (inputElement != undefined) {
                        console.log(inputElement);

                        if (inputElement.attr("type") == "checkbox") {
                            inputElement.prop("checked", (xmlAttr.nodeValue == "true"));
                        }
                        else {
                            inputElement.val(xmlAttr.nodeValue);
                        }
                    }
                }

                break;
        }

        //alert("(" + depth + ", " + itemsAdded + ") add..." + key + " - " + name);
        //alert("depth = " + depth);

        //newComponent.draggable({ stack:".component", handle: "h4", stop: function () { alert("Dropped1"); } });
        //newComponent.draggable({ stack: ".component", handle: "h4", stop: function () { alert("Dropped1"); } });

        element.append(newComponent);
        itemsAdded++;
    }

    depth--;
    //alert("(" + depth + ")");

    //alert("total items = " + itemsAdded);
}

function getGenericComponent(name, key, description, type, required, templateId) {
    var component = $("#component_generic").clone();
    if (templateId != undefined) {
        component = $("#" + templateId).clone();
    }
    component.removeAttr("id");
    component.find(".key").val(key);
    component.find(".name").val(name);
    component.find(".description").val(description);

    if (required) {
        component.find(".required").attr("checked", "checked"); //.val(required);
    }

    component.find(".component-heading").text(generateKey(type));
    component.find(".type").val(type);
    return component;
}

// Generate XML from interface
function updateXml() {
    var xml = "<CmsPageTemplate>";
    xml += getXmlTemplate($("#template"));
    xml += "</CmsPageTemplate>";
    $("#xml").val(xml);
}

function getXmlTemplate(outerElement) {
    var xml = "";

    //$(outerElement).find(" > .component").each(function () {
    //alert("XML children = " + $(outerElement).children(".component").length + ", " + outerElement.html());

    $(outerElement).children(".component").each(function () {
        var component = $(this);
        var name = component.find(".name").val();
        var key = component.find(".key").val();
        var type = component.find(".type").val();
        var description = component.find(".description").val();

        var required = component.find(".required:first").is(":checked");

        //alert(name + " req = " + required + "(" + component.find(".required:first").length + ")");

        switch (type) {
            case "container":
                xml += "<Component type=\"" + type + "\" key=\"" + key + "\" name=\"" + name + "\" description=\"" + description + "\" required=\"" + required + "\">" + getXmlTemplate(component.find(".container_content").first()) + "</Component>";
                break;
            default:
                xml += "<Component type=\"" + type + "\" key=\"" + key + "\" name=\"" + name + "\" description=\"" + description + "\" required=\"" + required + "\"";
                var storeFields = component.find("[data-xml-store]");
                storeFields.each(function () {
                    var field = $(this);
                    if (field.attr("type") == "checkbox") {

                        xml += " " + field.attr("data-xml-store") + "=\"" + field.is(":checked") + "\"";
                    }
                    else {
                        xml += " " + field.attr("data-xml-store") + "=\"" + field.val() + "\"";
                    }
                });
                xml += " />";
                break;
        }
    });

    return xml;
}

function generateKey(name) {
    var words = name.toLowerCase().split(" ");
    for (var i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substring(1);
    }
    return words.join("");
}