import axios from 'axios';
import {RecipeProps} from "./RecipeProps";

const baseURL = 'http://127.0.0.1:5000/api/v1';

export const getRecipes: () => Promise<RecipeProps[]> = () => {
    return axios
        .get(`${baseURL}/recipes`)
        .then(res => {
            return Promise.resolve(res.data);
        })
        .catch(error => {
            return Promise.reject(error);
        });
}
