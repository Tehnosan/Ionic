import axios from 'axios';
import io from 'socket.io-client';
import { authConfig, baseUrl, withLogs } from "../core";
import {RecipeProps} from "./RecipeProps";

const recipeUrl = `http://${baseUrl}/api/v1`;

export const getRecipes: (token: string, limit: number, page: number) => Promise<RecipeProps[]> = (token, limit, page) => {
    return withLogs(axios.get(`${recipeUrl}/recipes/${limit}/${page}`, authConfig(token)), 'getRecipes');
}

export const createRecipe: (token: string, recipe: RecipeProps) => Promise<RecipeProps[]> = (token, recipe) => {
    return withLogs(axios.post(`${recipeUrl}/recipe`, recipe, authConfig(token)), 'createRecipe');
}

export const updateRecipe: (token: string, recipe: RecipeProps) => Promise<RecipeProps[]> = (token, recipe) => {
    return withLogs(axios.put(`${recipeUrl}/recipe/${recipe.id}`, recipe, authConfig(token)), 'updateRecipe');
}

interface MessageData {
    type: string;
    payload: RecipeProps;
}

export const newWebSocket = (token: string, onmessage: (data: MessageData) => void) => {
    const socket = io('ws://127.0.0.1:5000');

    socket.on('connect', () => {
        console.info("web socket connect")
        socket.send(JSON.stringify({ type: 'authorization', payload: { token } }));
    });

    socket.on('disconnect', () => {
        console.info("web socket disconnect")
    });

    return () => {
        socket.close();
    }
}













