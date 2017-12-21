/**
 * 提供元数据与grid整合的功能
 */
import controlTypeService from 'services/metaform/control_type_service';
import renderManager from './metagrid_render';

/**
 *  将metaField转成ivue需要的col对象
 * @param metaField
 */
function metaFieldToCol(context,metaField) {
  var col = {
    title: metaField.title,
    key: metaField.name,
    sortable: metaField.sortable,
    _metaField: metaField,
  };
  //优先根据前端设置的type字段，设置列的渲染方式
  if (metaField.type == "operation") {
    col.render = renderManager.renderForOperation(context,metaField);
  }else if (metaField.type == "imgTitle") {
    col.render = renderManager.renderForImgTitle(context,metaField);
  } else {
    if (controlTypeService.isPictureUpload(metaField.inputType)) {
      col.render = renderManager.renderForPictureUpload(context,metaField);
    } else if (controlTypeService.isFileUpload(metaField.inputType)) {
      col.render = renderManager.renderForFileUpload(context,metaField);
    } else {
      col.render = renderManager.renderForCommon(context,metaField);
    }
  }
  return col;
}

/**
 * 图片上传控件
 * @param metaField
 * @returns {Function}
 */
function renderForPictureUpload(context,metaField) {
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
function renderForFileUpload(context,metaField) {
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
function renderForImgTitle(context,metaField) {
  return function(h,params) {
    return h("meta-grid-img-title", {
      props: {
        params: metaField,
        item: params.row
      },
      on: {
        click: function () {
          metaField.actionFunc && metaField.actionFunc.call(context,params);
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
function renderForOperation(context,metaField) {
  let btns=metaField.btns;
  return function(h,params){
    return h("meta-grid-operation-btn",{
      props:{
        btns:btns
      },
      on:{
        click:function(btn){
          btn.actionFunc.call(context,params);
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
function renderForCommon(context,metaField) {
  return function(h,params){
    var value=controlTypeService.formatData(params.row,metaField);
    return h("meta-grid-render-html",{
      props:{
        value:value
      }
    });
  }
}




export default{
  metaFieldToCol:metaFieldToCol
}



