export interface Product {
    type: string,
    id: number,
    links: Links,
    attributes: Attributes,
}

export interface Links {
    redirect?: string,
    first?: string,
    self: string,
    last?: string,
    next?: string,
}

export interface Attributes {
    menu: string,
    title: string,
    description: string,
    weight: number,
    price: number,
    old_price: number,
    discount_percentage: number,
    price_with_discount: number,
    offer?: Offer,
    has_free_shipping: boolean,
    is_pre_order: boolean,
    date_pre_order: number,
    available: boolean,
    stock: number,
    limit_buy: number,
    type: number,
    warranty: string,
    score_of_ratings: number,
    number_of_ratings: number,
    is_marketplace: boolean,
    manufacturer: Manufacturer,
    photos: Photos,
    images: string[],
    tag_description: string,
    featured_product: boolean,
    stamps?: Stamps,
    max_installment: string,
    product_link: string,
}

export interface Offer {
    id: string,
    name: string,
    reference_banner: string,
    starts_at: number,
    ends_at: number,
    quantity_available: number,
    price: number,
    price_with_discount: number,
    discount_percentage: number,
    is_logged_user_exclusive: boolean,
}

export interface Manufacturer {
    id: string,
    name: string,
    img: string,
}

export interface Photos {
    p: string[],
    m: string[],
    g: string[],
    gg: string[],
}

export interface Stamps {
    id: number,
    title: string,
    name: string,
    description: string,
    link_rule: string,
    background_color: string,
    font_color: string,
    type: string,
}