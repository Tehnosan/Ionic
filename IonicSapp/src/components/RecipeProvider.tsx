import React, {useCallback, useEffect, useReducer, useContext, useState} from 'react';
import PropTypes from 'prop-types'
import { RecipeProps } from "./RecipeProps";
import {getRecipes, createRecipe, updateRecipe ,newWebSocket} from "./recipeApi";
import { AuthContext } from "../authentication";
import {Plugins} from "@capacitor/core";

type SaveRecipeFn = (recipe: RecipeProps, recipes: RecipeProps[]) => Promise<any>;
type SearchNextFn = ($event: CustomEvent<void>, recipes?: RecipeProps[]) => Promise<any>;

export interface RecipesState {
    recipes?: RecipeProps[],
    fetching: boolean,
    fetchingError?: Error | null,
    saving: boolean,
    savingError?: Error | null,
    saveRecipe?: SaveRecipeFn,
    searchNext?: SearchNextFn,
    disableInfiniteScroll: boolean
}

interface ActionProps{
    type: string,
    payload?: any,
}

const initialState: RecipesState = {
    fetching: false,
    saving: false,
    disableInfiniteScroll: false
};

const FETCH_RECIPES_STARTED = 'FETCH_RECIPES_STARTED';
const FETCH_RECIPES_SUCCEEDED = 'FETCH_RECIPES_SUCCEEDED';
const FETCH_RECIPES_FAILED = 'FETCH_RECIPES_FAILED';
const SAVE_RECIPE_STARTED = 'SAVE_RECIPE_STARTED';
const SAVE_RECIPE_SUCCEEDED = 'SAVE_RECIPE_SUCCEEDED';
const SAVE_RECIPE_FAILED = 'SAVE_RECIPE_FAILED';
const FETCH_STORAGE = "FETCH_STORAGE";

const reducer: (state: RecipesState, action: ActionProps) => RecipesState =
    (state, {type, payload}) => {
        switch (type) {
            case FETCH_STORAGE:
                return { ...state, disableInfiniteScroll: true};
            case FETCH_RECIPES_STARTED:
                return { ...state, fetching: true, fetchingError: null };

            case FETCH_RECIPES_SUCCEEDED:
                return { ...state, recipes: payload.recipes, fetching: false, disableInfiniteScroll: false };

            case FETCH_RECIPES_FAILED:
                return { ...state, fetchingError: payload.error, fetching: false };

            case SAVE_RECIPE_STARTED:
                return { ...state, savingError: null, saving: true};

            case SAVE_RECIPE_SUCCEEDED:
                const recipes = [...(state.recipes || [])];
                const recipe = payload.recipe;
                const index = recipes.findIndex(it => it.id === recipe.id);

                console.info(recipe);

                if(index === -1){
                    recipes.splice(0, 0, recipe);
                }
                else {
                    recipes[index] = recipe;
                }
                return { ...state, recipes, saving: false };

            case SAVE_RECIPE_FAILED:
                return { ...state, savingError: payload.error, saving: false };

            default:
                return state;
        }
    };

export const RecipeContext = React.createContext<RecipesState>(initialState);

interface RecipeProviderProps {
    children: PropTypes.ReactNodeLike;
}

export const RecipeProvider: React.FC<RecipeProviderProps> = ({children}) => {
    const recipesPerPage = 15;
    let page = 0;
    
    const { token } = useContext(AuthContext);
    const [state, dispatch] = useReducer(reducer, initialState);
    const { recipes, fetching, fetchingError, saving, savingError, disableInfiniteScroll } = state;

    useEffect(getRecipesEffect, [token]);
    useEffect(wsEffect, [token]);

    const saveRecipe = useCallback<SaveRecipeFn>(saveRecipeCallback, [token]);
    const searchNext = useCallback<SearchNextFn>(getMoreRecipes, [token]);
    const value = { recipes, fetching, fetchingError, saving, savingError, saveRecipe, searchNext, disableInfiniteScroll };

    return (
        <RecipeContext.Provider value={value}>
            {children}
        </RecipeContext.Provider>
    );

    async function getMoreRecipes($event: CustomEvent<void>, recipes?: RecipeProps[]) {
        let new_recipes: RecipeProps[] = [];
        let new_all_recipes: RecipeProps[] = [];
        const { Storage } = Plugins;
        page += 1;

        dispatch({ type: FETCH_RECIPES_STARTED });
        new_recipes = await getRecipes(token, recipesPerPage, page);

        if (recipes) {
            new_all_recipes = [...recipes, ...new_recipes];
        }

        await Storage.set({
           key: 'recipes',
           value: JSON.stringify(new_all_recipes)
        });

        dispatch({ type: FETCH_RECIPES_SUCCEEDED, payload: { recipes: new_all_recipes } });

        await ($event.target as HTMLIonInfiniteScrollElement).complete();
    }

    function getRecipesEffect() {
        let canceled = false;
        fetchRecipes();

        return () => {
            canceled = true;
        }

        async function fetchRecipes() {
            if(!token?.trim()) {
                return;
            }
            try {
                dispatch({ type: FETCH_RECIPES_STARTED });
                page += 1;
                const recipes = await getRecipes(token, recipesPerPage, page);
                const { Storage } = Plugins;

                if (!canceled) {
                    dispatch({ type: FETCH_RECIPES_SUCCEEDED, payload: { recipes } });

                    await Storage.set({
                        key: 'recipes',
                        value: JSON.stringify(recipes)
                    });
                }
            } catch (error) {
                const { Storage } = Plugins;

                dispatch({ type: FETCH_RECIPES_STARTED });
                const recipes_storage = await Storage.get({key: 'recipes'});

                if (recipes_storage.value) {
                    const parsed_recipes = JSON.parse(recipes_storage.value);
                    dispatch({ type: FETCH_RECIPES_SUCCEEDED, payload: { recipes: parsed_recipes } });
                    dispatch({ type: FETCH_STORAGE });
                }
                else {
                    dispatch({ type: FETCH_RECIPES_FAILED, payload: { error } });
                }
            }
        }
    }

    async function saveRecipeCallback(recipe: RecipeProps, recipes: RecipeProps[]) {
        try {
            dispatch({ type: SAVE_RECIPE_STARTED });

            let savedRecipe;
            // console.info(`recipe.id: ${recipe.id}`);
            // console.info(`recipes: ${recipes}`);
            // console.info(`recipes.length: ${recipes?.length}`);
            if(recipe.id && recipes && recipes.length + 1 == parseInt(recipe.id)){
                savedRecipe = await createRecipe(token, recipe);
            }
            else {
                savedRecipe = await updateRecipe(token, recipe);
            }

            dispatch({ type: SAVE_RECIPE_SUCCEEDED, payload: { recipe: savedRecipe } });
        } catch (error) {
            dispatch({type: SAVE_RECIPE_FAILED, payload: {error}});
        }
    }

    function wsEffect() {
        let canceled = false;
        console.info("wsEffect - connecting");
        let closeWebSocket: () => void;

        if (token?.trim()) {
            closeWebSocket = newWebSocket(token, message => {
                if(canceled) {
                    return;
                }

                const { type, payload: recipe } = message;
                console.info(`ws message, recipe ${type}`);
                if(type == 'created' || type == 'updated') {
                    dispatch({type: SAVE_RECIPE_SUCCEEDED, payload: { recipe } });
                }
            });
        }

        return () => {
            console.info("wsEffect - disconnecting");
            canceled = true;
            closeWebSocket?.();
        }
    }
};
