/**
 * 提供元数据与grid整合的功能
 */
var metabase=require("libs/metadata/metabase");
var controlTypeService=require('services/metaform/control_type_service');

/**
 *  将metaField转成ivue需要的col对象
 * @param metaField
 */
function metaFieldToCol(metaField) {
  var col = {
    title: metaField.title,
    key: metaField.name,
    sortable: metaField.sortable,
    _metaField: metaField,
  };
  //优先根据前端设置的type字段，设置列的渲染方式
  if (!_.isNaN(metaField.type)) {
    if (metaField.type == "operation") {
      col.render = renderForOperation(metaField);
    } else if (metaField.type == "imgTitle") {
      col.render = renderForImgTitle(metaField);
    }
  } else {
    if (controlTypeService.isPictureUpload(metaField.inputType)) {
      col.render = renderForPictureUpload(metaField);
    } else if (controlTypeService.isFileUpload(metaField.inputType)) {
      col.render = renderForFileUpload(metaField);
    } else {
      col.render = renderForCommon(metaField);
    }
  }
}




/**
 * 图片上传控件
 * @param metaField
 * @returns {Function}
 */
function renderForPictureUpload(metaField) {
  return function(h,params) {
    return h("meta-grid-pictures", {
      props: {
        params: metaField,
        item: params.row
      }
    });
  }
}

/**
 * 文件上传控件
 * @param metaField
 * @returns {*}
 */
function renderForFileUpload(metaField) {
  return function(h,params) {
    return h("meta-grid-files", {
      props: {
        params: metaField,
        item: params.row
      }
    });
  }
}

/**
 * 带图片的标题头显示
 * @returns {*}
 */
function renderForImgTitle(metaField) {
  return function(h,params) {
    var _this=this;
    return h("meta-grid-img-title", {
      props: {
        params: metaField,
        item: params.row
      },
      on: {
        click: function () {
          metaField.actionFunc && metaField.actionFunc.call(_this,params);
        }
      }
    });
  }
}

/**
 * 操作列
 * @param metaField
 * @returns {Function}
 */
function renderForOperation(metaField) {
  let btns=metaField.btns;
  return function(h,params){
    var _this=this;
    return h("meta-grid-operation-btn",{
      props:{
        btns:btns
      },
      on:{
        click:function(btn){
          btn.actionFunc.call(_this,params);
        }
      }
    });
  }
}

/**
 * 通用渲染
 * @param metaField
 * @returns {Function}
 */
function renderForCommon(metaField) {
  return function(h,params){
    var value=controlTypeService.formatData(params.row,metaField);
    return h("meta-grid-render-html",{
      props:{
        value:value
      }
    });
  }
}


module.exports={
  metaFieldToCol:metaFieldToCol
}



