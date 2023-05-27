import {defineStore} from "pinia";
import {Link} from "@/types";
import {request} from "@/utils";

export const useLinkStore = defineStore('link', {
    actions: {
        async addLink(params: Partial<Omit<Link, 'id'>>) {
            return request.post('/link/add', params)
        },
        async updateLink({id, ...params}: Partial<Link>) {
            return request.post('/link/update', params, {params: {id}})
        },
        getLinkInfo(params: Pick<Link, 'id'>) {
            return request.get('/link/info', params)
        },
        getLinkList(pageInfo: Partial<{ pageNum: number, pageSize: number }>) {
            return request.post('/link/list', {}, {params: pageInfo})
        }
    }
})