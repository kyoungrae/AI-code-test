/**
 * @title : 그리드 정렬 관리자
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
        this.saveSortState();
    }

    getSort() {
        this.loadSortState();
        return {
            column: this.sortColumn,
            order: this.sortOrder
        };
    }

    resetSort() {
        this.sortColumn = null;
        this.sortOrder = null;
        this.saveSortState();
    }

    saveSortState() {
        const prgmId = window.PRGMID || "default";
        const state = {
            column: this.sortColumn,
            order: this.sortOrder
        };
        localStorage.setItem(`grid_sort_${prgmId}`, JSON.stringify(state));
    }

    loadSortState() {
        const prgmId = window.PRGMID || "default";
        const saved = localStorage.getItem(`grid_sort_${prgmId}`);
        if (saved) {
            try {
                const state = JSON.parse(saved);
                this.sortColumn = state.column;
                this.sortOrder = state.order;
            } catch (e) {
                console.error("Failed to parse saved sort state", e);
            }
        }
        return {
            column: this.sortColumn,
            order: this.sortOrder
        };
    }
}
