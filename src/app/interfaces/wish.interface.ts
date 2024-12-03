export interface Wish {
    id?: string;
    type: "wish"
    wish: string;
    link: string;
    priority: string;
    image: string;
    completedAt: any;
    completed: boolean;
    owener: string;
}