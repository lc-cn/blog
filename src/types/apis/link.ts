import { Link, Pagination} from "@/types";

export interface LinkApis{
    '/link/list'(pagination:Partial<Pick<Pagination, 'pageNum'|'pageSize'>>):Pagination<Link[]>
    '/link/info'(params:Pick<Link, 'id'>):Link
    '/link/add'(params:Partial<Omit<Link, 'id'>>):boolean
    '/link/update'(params:Partial<Omit<Link, 'id'>>):boolean
    '/link/delete'(params:Pick<Link, 'id'>):boolean
}