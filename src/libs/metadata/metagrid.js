/**
 * 提供元数据与grid整合的功能
 */
import controlTypeService from 'services/metaform/control_type_service';
import metabase from 'libs/metadata/metabase';
import renderManager from './metagrid_render';
import operationManager from './metagrid_operation';

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
 * 根据元数据信息初始化Grid
 * @param grid
 */
function initGridByMetabase(grid) {
  intiGridProperties(grid);

  initToolBar(grid);

  initColumns(grid);
}


/**
 * 实始化grid的基本属性
 * @param grid
 */
function intiGridProperties(grid) {
  var metaEntityObj=null;
  if(!_.isEmpty(grid.metaEntity)){
    metaEntityObj=metabase.findMetaEntity(grid.metaEntity);
  }
  if(metaEntityObj==null){
    return;
  }

  if(_.isEmpty(grid.queryResource)){
    grid.queryResource=metaEntityObj.dataResource;
  }
}

/**
 * 初始化列
 */
function  initColumns(grid) {
  var metaEntityObj=null;
  if(!_.isEmpty(grid.metaEntity)){
    metaEntityObj=metabase.findMetaEntity(grid.metaEntity);
  }
  var context={
    grid:grid,
    metaEntity:metaEntityObj
  };
  _.each(grid.columns,function(col){
    var metaParams=col.metaParams ||{};
    var _col=_.omit(col,["metaParams"]);
    var metaField={};
    if(metaEntityObj!=null){
      metaField=metaEntityObj.findField(_col.key) || {};
    }
    metaField=_.extend(metaField,metaParams);
    var defaultCol=metaFieldToCol(context,metaField);
    _col=_.extend(defaultCol,_col);
    grid.innerColumns.push(_col);
  });
}

function  initToolBar(grid) {
  var btns=[];
  var metaEntityObj=null;
  if(!_.isEmpty(grid.metaEntity)){
    metaEntityObj=metabase.findMetaEntity(grid.metaEntity);
  }
  var context={
    grid:grid,
    metaEntity:metaEntityObj
  };
  _.forEach(grid.toolbar.btns,function (btn,index) {
    var mergedBtn=operationManager.fillOperationByMb(context,btn);
    btns.push(mergedBtn);
  });
  grid.toolbar.btns=btns;
}

export default{
  initGridByMetabase:initGridByMetabase,
}



