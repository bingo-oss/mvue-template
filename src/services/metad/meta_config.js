var Config=require("../../config/config");
//var baseServer="http://localhost:8080"+"/metad/api";
var baseServer=Config.gatewayUrl+"/metad/api";

module.exports={
    baseServer:baseServer
};
