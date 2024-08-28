// sap.ui.define([
//     "sap/ui/core/mvc/Controller"
// ],
// function (Controller) {
//     "use strict";

//     return Controller.extend("com.asap.controller.View1", {
//         onInit: function () {

//         }
//     });
// });
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/StandardListItem",
    "sap/m/Tree"
], function (Controller, JSONModel, StandardListItem, Tree) {
    "use strict";
    return Controller.extend("com.asap.controller.View1", {
        onInit: function () {
            // Sample data for the Tree
            var oData = {
                nodes: [
                    {
                        name: "Node 1",
                        isExpanded: true,
                        nodes: [
                            {
                                name: "Child Node 1",
                                isExpanded: false,
                                nodes: []
                            },
                            {
                                name: "Child Node 2",
                                isExpanded: false,
                                nodes: []
                            }
                        ]
                    },
                    {
                        name: "Node 2",
                        isExpanded: false,
                        nodes: []
                    }
                ]
            };

            // Create a JSON model and set the data
            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel);

            // Build the tree structure dynamically
            this._buildTree(this.getView().byId("tree"), oData.nodes);
        },

        _buildTree: function (oTree, aNodes) {
            // Clear existing nodes
            oTree.destroyItems();

            // Recursive function to build tree nodes
            function createTreeItems(aNodes, oParent) {
                aNodes.forEach(function (oNode) {
                    var oListItem = new StandardListItem({
                        title: oNode.name
                    });
                    oParent.addItem(oListItem);

                    if (oNode.nodes && oNode.nodes.length > 0) {
                        var oSubTree = new Tree({
                            items: []
                        });
                        createTreeItems(oNode.nodes, oSubTree);
                        oListItem.addAggregation("items", oSubTree);
                    }
                });
            }

            // Start building the tree from the root nodes
            createTreeItems(aNodes, oTree);
        },

        onDownloadTree: function () {
            // Get the tree data
            var oTreeModel = this.getView().getModel();
            var oTreeData = oTreeModel.getData();

            // Convert the tree data to JSON string
            var sTreeDataJSON = JSON.stringify(oTreeData, null, 2);

            // Create a blob from the JSON data
            var blob = new Blob([sTreeDataJSON], { type: "application/json" });

            // Create a download link and trigger the download
            var url = URL.createObjectURL(blob);
            var a = document.createElement("a");
            a.href = url;
            a.download = "treeData.json";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            // Revoke the object URL to free up memory
            URL.revokeObjectURL(url);
        }
    });
});
