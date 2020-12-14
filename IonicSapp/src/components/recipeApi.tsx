import axios from 'axios';
import io from 'socket.io-client';
import { authConfig, baseUrl, withLogs } from "../core";
import {RecipeProps} from "./RecipeProps";

const recipeUrl = `http://${baseUrl}/api/v1`;

export const getRecipes: (token: string) => Promise<RecipeProps[]> = token => {
    return withLogs(axios.get(`${recipeUrl}/recipes`, authConfig(token)), 'getRecipes');
}

export const createRecipe: (token: string, recipe: RecipeProps) => Promise<RecipeProps[]> = (token, recipe) => {
    return withLogs(axios.post(`${recipeUrl}/recipe`, recipe, authConfig(token)), 'createRecipe');
}

export const updateRecipe: (token: string, recipe: RecipeProps) => Promise<RecipeProps[]> = (token, recipe) => {
    return withLogs(axios.put(`${recipeUrl}/recipe/${recipe.id}`, recipe, authConfig(token)), 'updateRecipe');
}

interface MessageData {
    event: string;
    // payload: {
    //     recipe: RecipeProps;
    // };
}

// export const newWebSocket = (onmessage: (data: MessageData) => void) => {
//     const ws = new WebSocket(`ws://${baseURL}`)
//
//     ws.onopen = () => {
//         console.info("web socket onopen");
//     };
//     ws.onclose = () => {
//         console.info("web socket onclose");
//     };
//     ws.onerror = error =>{
//         console.info("web socket onerror", error);
//     };
//     ws.onmessage = messageEvent => {
//         console.info("web socket onmessage");
//         onmessage(JSON.parse(messageEvent.data));
//     };
//
//     return () => {
//         ws.close();
//     }
// }

// export const newWebSocket = (onmessage: (data: MessageData) => void) => {
//     const socket = io('http://127.0.0.1:5000/api/v1');
//
//     socket.on('connect', () => {
//         console.info("connect client");
//         socket.emit("my event", {x : "x"});
//         console.info("connect client 2");
//     });
//
//     socket.io.on("event", () => {
//         console.info("event");
//     });
//
//     socket.on('abc', () => {
//         console.info("socketio added");
//     });
//
//     return socket.close;
// }













