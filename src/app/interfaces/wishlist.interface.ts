export interface Wishlist {
    id?: string;
    type: "shared"
    displayName: string | null
    wishes:
    {
        wishName: string,
        link: string,
        image: string,
        priority: string,
        completedAt: any,
        completed: boolean,
    }[];
}