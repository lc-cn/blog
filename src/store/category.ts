import {defineStore} from "pinia";
import config from '@/config'
import {Category, CategoryTree} from "@/types";
import {request} from "@/utils";

export const useCategoryStore = defineStore('category', {
    state() {
        return {
            categories: JSON.parse(localStorage.getItem(config.tokenKey + ':categories') || '[]')
        } as {
            categories: CategoryTree
        }
    },
    actions: {
        async init(pId: number | null = null, force?: boolean) {
            if (!force && this.categories.length) {
                return Promise.resolve()
            }
            const res = await request.get('/category/tree', {pId})
            if (res.code === 200) {
                this.categories = res.data
                localStorage.setItem(config.tokenKey + ':categories', JSON.stringify(res.data))
            }
            return true
        },
        async getCategoryWithArticles(params: Pick<Category, 'id'>) {
            return request.get('/category/articles', params)
        },
        async addCategory(params: Partial<Omit<Category, 'id'>>) {
            return request.post('/category/add', params)
        },
        async updateCategory({id, ...params}: Partial<Category>) {
            return request.post('/category/update', params, {params: {id}})
        },
        getCategoryInfo(params: Pick<Category, 'id'>) {
            return request.get('/category/info', params)
        },
        getCategoryTree(params: { pId: number | null }) {
            return request.get('/category/tree', params)
        },
        getCategoryList(pageInfo: Partial<{ pageNum: number, pageSize: number }>) {
            return request.post('/category/list', {}, {params: pageInfo})
        }
    }
})