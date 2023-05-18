import {App} from "vue";
import {vPermission} from './permission'
export default {
    install(app:App){
        app.directive('vPermission',vPermission)
    }
}