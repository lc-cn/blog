import {UserApis} from "./user";
import {ConfigApis} from "./config";
import {RoleApis} from "./role";
import {MenuApis} from "./menu";
import {CategoryApis} from "./category";
import {TagApis} from "./tag";
import {ArticleApis} from "./article";
import {CommentApis} from "./comment";
import {LinkApis} from "@/types/apis/link";

export interface RequestMap extends UserApis,
    ConfigApis,
    RoleApis,
    CategoryApis,
    MenuApis,
    TagApis,
    ArticleApis,
    CommentApis,
    LinkApis{
}