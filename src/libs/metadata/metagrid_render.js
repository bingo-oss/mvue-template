/**
 * 提供内置的列的渲染
 */
import controlTypeService from 'services/metaform/control_type_service';

export default {
  /**
   * 图片上传控件
   * @param metaField
   * @returns {Function}
   */
  renderForPictureUpload: function (context, metaField) {
    return function (h, params) {
      return h("meta-grid-pictures", {
        props: {
          params: metaField,
          item: params.row
        }
      });
    }
  },

  /**
   * 文件上传控件
   * @param metaField
   * @returns {*}
   */
  renderForFileUpload: function(context, metaField) {
    return function (h, params) {
      return h("meta-grid-files", {
        props: {
          params: metaField,
          item: params.row
        }
      });
    }
  },

  /**
   * 带图片的标题头显示
   * @returns {*}
   */
  renderForImgTitle: function (context, metaField) {
    return function (h, params) {
      return h("meta-grid-img-title", {
        props: {
          params: metaField,
          item: params.row
        },
        on: {
          click: function () {
            metaField.actionFunc && metaField.actionFunc.call(context, params);
          }
        }
      });
    }
  },

  /**
   * 操作列
   * @param metaField
   * @returns {Function}
   */
  renderForOperation: function (context, metaField) {
    let btns = metaField.btns;
    return function (h, params) {
      return h("meta-grid-operation-btn", {
        props: {
          btns: btns
        },
        on: {
          click: function (btn) {
            btn.actionFunc.call(context, params);
          }
        }
      });
    }
  },

  /**
   * 通用渲染
   * @param metaField
   * @returns {Function}
   */
  renderForCommon: function (context, metaField) {
    return function (h, params) {
      var value = controlTypeService.formatData(params.row, metaField);
      return h("meta-grid-render-html", {
        props: {
          value: value
        }
      });
    }
  }
}



