import axios from 'axios';
import io from 'socket.io-client';
import {RecipeProps} from "./RecipeProps";

const baseURL = 'http://127.0.0.1:5000/api/v1';

const config = {
    headers:{
        'Content_Type' : 'application/json'
    }
};

export const getRecipes: () => Promise<RecipeProps[]> = () => {
    return axios
        .get(`${baseURL}/recipes`, config)
        .then(res => {
            return Promise.resolve(res.data);
        })
        .catch(error => {
            return Promise.reject(error);
        });
}

export const createRecipe: (recipe: RecipeProps) => Promise<RecipeProps[]> = recipe => {
    return axios
        .post(`${baseURL}/recipe`, recipe, config)
        .then(res => {
            return Promise.resolve(res.data);
        })
        .catch(error => {
            return Promise.reject(error);
        });
}

export const updateRecipe: (recipe: RecipeProps) => Promise<RecipeProps[]> = recipe => {
    return axios
        .put(`${baseURL}/recipe/${recipe.id}`, recipe, config)
        .then(res => {
            return Promise.resolve(res.data);
        })
        .catch(error => {
            return Promise.reject(error);
        });
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













