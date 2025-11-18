import type { Links, Product } from "../product/types";

export interface Products {
    meta: Meta,
    links: Links,
    data: Product[],
}

export interface Meta {
    total_items_count: number,
    total_pages_count: number,
    page: Page,
}

export interface Page {
    cursor: string,
    number: number,
    size: number,
    is_current_page: boolean,
}
