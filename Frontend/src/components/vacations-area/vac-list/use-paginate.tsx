import { useState } from "react";

export function usePagination<T>(items: T[], pageSize: number) {
    const [page, setPage] = useState(0);

    const pageCount = Math.ceil(items.length / pageSize);
    const visible = items.slice(page * pageSize, (page + 1) * pageSize);

    return { page, setPage, pageCount, visible };
}

