var Config=require("src/libs/config_helper");
export default{
    entityModelRedundantKey:'_data',
    entityModelTitleKey:'title',
    paths:{
        uploadUrl:Config.getUploadUrl(),
        userApiUrl:Config.getUserApiUrl(),
        orgApiUrl:Config.getOrgApiUrl()
    }
}
