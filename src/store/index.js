//import core from './modules/core';
function newStore(Vuex){
    return new Vuex.Store({
        modules: {
            //core
        }
    });
}
export default newStore