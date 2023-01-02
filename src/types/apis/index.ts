import {UserApis} from "./user";
import {ConfigApis} from "./config";
import {RoleApis} from "./role";
import {MenuApis} from "@/types/apis/menu";

export interface RequestMap extends UserApis,ConfigApis,RoleApis,MenuApis{
}