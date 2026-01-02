/**
 * @title : GridSortManager
 * @text : 현재 Grid 정렬 상태를 관리해주는 클래스
 * @writer : 진은영
 * */
class GridSortManager {
    constructor() {
        this.sortColumn = null;
        this.sortOrder = null;
    }

    setSort(column, order) {
        this.sortColumn = column;
        this.sortOrder = order;
    }

    getSort() {
        return {
            sortColumn: this.sortColumn,
            sortOrder: this.sortOrder
        };
    }

    resetSort() {
        this.sortColumn = null;
        this.sortOrder = null;
    }

    loadSortState() {
        return this.getSort();
    }
}
