const metaformJson={
    metaEntityName:"Menu",
    layout:[
        {
            "id":"4f2bff00-e52a-11e7-b1bc-47296c5e2ff9",
            "isDataField":true,
            "componentType":"SingleLineText",
            "dataField":"title",
            "componentParams":{
                "title":"名称",
                "required":true,
                "placeholder":"",
                "unique":false,
                "limitLength":{
                    "limit":false,
                    "max":200,
                    "min":0
                },
                "validation":{
                    "validate":false,
                    "rule":{
                        "type":"",
                        "brief":"",
                        "pattern":""
                    }
                }
            }
        },
        {
            "id":"2",
            "isDataField":true,
            "componentType":"SingleLineText",
            "dataField":"name",
            "componentParams":{
                "title":"编码",
                "description":"",
                "required":true,
                "placeholder":"唯一标志",
                "unique":true,
                "limitLength":{
                    "limit":false,
                    "max":200,
                    "min":0
                },
                "validation":{
                    "validate":false,
                    "rule":{
                        "type":"",
                        "brief":"",
                        "pattern":""
                    }
                }
            }
        },
        {
            "id":"3",
            "isDataField":true,
            "componentType":"SingleLineText",
            "dataField":"url",
            "componentParams":{
                "title":"地址",
                "description":"",
                "required":true,
                "placeholder":"地址",
                "unique":false,
                "limitLength":{
                    "limit":false,
                    "max":200,
                    "min":0
                },
                "validation":{
                    "validate":false,
                    "rule":{
                        "type":"",
                        "brief":"",
                        "pattern":""
                    }
                }
            }
        },
        {
            "id":"4",
            "isDataField":true,
            "componentType":"SingleLineText",
            "dataField":"icon",
            "componentParams":{
                "title":"图标",
                "description":"",
                "required":true,
                "placeholder":"",
                "unique":false,
                "limitLength":{
                    "limit":false,
                    "max":200,
                    "min":0
                },
                "validation":{
                    "validate":false,
                    "rule":{
                        "type":"",
                        "brief":"",
                        "pattern":""
                    }
                }
            }
        },
        {
            "id":"5",
            "isDataField":true,
            "componentType":"SingleLineText",
            "dataField":"cssName",
            "componentParams":{
                "title":"样式名",
                "description":"",
                "required":false,
                "placeholder":"",
                "unique":false,
                "limitLength":{
                    "limit":false,
                    "max":200,
                    "min":0
                },
                "validation":{
                    "validate":true,
                    "rule":{
                        "type":"compare",
                        "operator":"equals",
                        "fieldName":"icon"
                    }
                }
            }
        },
        {
            "id":"6",
            "isDataField":true,
            "componentType":"RadioButton",
            "dataField":"status",
            "componentParams":{
                "title":"状态",
                "description":"",
                "options":[{id:0,text:"禁用"},{id:1,text:"启用",checked:true}],
                "required":true,
                "placeholder":"",
                "unique":false,
                "limitLength":{
                    "limit":false,
                    "max":200,
                    "min":0
                },
                "validation":{
                    "validate":false,
                    "rule":{
                        
                    }
                }
            }
        }
    ]
};
export default metaformJson;