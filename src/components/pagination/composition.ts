import {ref} from "vue";

interface Composition {
    pageSize:number
    pageNum:number
    total:number
    onSizeChange(size:number):void
    onPageChange(page:number):void
}
export function usePagination({pageSize=20, pageNum=1,total=0, onSizeChange, onPageChange}:Partial<Composition>={}){
    const pagination=ref({
        pageSize,
        pageNum,
        total,
    })
    const setPagination=(newPagination:Partial<Composition>)=>{
        pagination.value={
            ...pagination.value,
            ...newPagination
        }
    }
    const setPageSize=(pageSize:number)=>{
        pagination.value.pageSize=pageSize
        onSizeChange && onSizeChange(pageSize)
    }
    const setPageNum=(pageNum:number)=>{
        pagination.value.pageNum=pageNum
        onPageChange && onPageChange(pageNum)
    }
    const setTotal=(total:number)=>{
        pagination.value.total=total
    }
    return {
        pagination,
        setPagination,
        setPageSize,
        setPageNum,
        setTotal
    }
}