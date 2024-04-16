class SortUtils {
    sortAscending(arr) {
        return [...arr].sort((a, b) => a - b);
    }
}

export const sortUtils = new SortUtils();
