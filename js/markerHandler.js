var modelList = []
AFRAME.registerComponent("markerhandler",{
    init:function(){
        this.el.addEventListener("markerFound",()=>{
            
        })
    },
    getDistance: function(elA, elB){
        return elA.object3D.position.distanceTo(elB.object3D.position)
    },
    getModelGeometry:function(models, modelName){
        var barcodes = Object.keys(models)
        for (var barcode of barcodes) {
            if (models[barcode].model_name === modelName) {
                return { 
                    position: models[barcode]["placement_position"],
                    rotation: models[barcode]["placement_rotation"],
                    scale: models[barcode]["placement_scale"],
                    model_url: models[barcode]["model_url"]
                };
            }
          }
    },
    placeTheModel:function(modelName, models){
        var isListContainModel = this.isModePresentInArray(modelList,modelName)
        if (isListContainModel) {
            var distance = null;
            var marker1 = document.querySelector(`#marker-base`);
            var marker2 = document.querySelector(`#marker-${modelName}`);

            distance = this.getDistance(marker1, marker2)
            if (distance < 1.25) {
                var modelEl = document.querySelector(`#${modelName}`)
                modelEl.setAttribute("visible", false);

                var isModePlaced = document.querySelector(`#model-${modelName}`)
                if (isModePlaced === null) {
                    var el = document.createElement("a-entity");
                    var modelGeometry = this.getModelGeometry(models, modelName);
                    el.setAttribute("id", `model-${modelName}`)
                    el.setAttribute("glft-model", `url(${modelGeometry.model_url})`);
                    el.setAttribute("position", modelGeometry.position)
                    el.setAttribute("position", modelGeometry.rotation)
                    el.setAttribute("position", modelGeometry.scale)
                    marker1.appendChild(el)
                }
            }
        }
    },
    isModelPresentInArray: function(arr, val){
        for (var i of arr){
            if(i.model_name === val){
                return true;
            }
        }
        return false
    },
    tick: async function(){
        if(modelList.length > 1){
            var isBaseModelPresent = this.isBaseModelPresent(modelList, "base");
            var messageText = document.querySelector("#message-text");

            if(!isBaseModelPresent){
                messageText.setAttribute("visible", true);
            } else {
                if(models === null){
                    models = await this.getModels()
                }

                messageText.setAttribute("visible", false);
                this.placeTheModel("road", models);
                this.placeTheModel("car", models);
                this.placeTheModel("building1", models);
                this.placeTheModel("building2", models);
                this.placeTheModel("building3", models);
                this.placeTheModel("tree", models);
                this.placeTheModel("sun", models);
            }
        }
    },

})