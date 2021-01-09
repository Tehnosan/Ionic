export interface RecipeProps {
    id?: string;
    name: string;
    time: string;
    difficulty: string;
    photoName?: string | Promise<string>;
    latitude?: number;
    longitude?: number;
}
