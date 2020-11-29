import React, {useCallback, useEffect, useReducer} from 'react';
import PropTypes from 'prop-types'
import { RecipeProps } from "./RecipeProps";
import {getRecipes, createRecipe, updateRecipe, newWebSocket} from "./recipeApi";

type SaveRecipeFn = (recipe: RecipeProps, recipes: RecipeProps[]) => Promise<any>;

export interface RecipesState {
    recipes?: RecipeProps[],
    fetching: boolean,
    fetchingError?: Error | null,
    saving: boolean,
    savingError?: Error | null,
    saveRecipe?: SaveRecipeFn,
}

interface ActionProps{
    type: string,
    payload?: any,
}

const initialState: RecipesState = {
    fetching: false,
    saving: false,
};

const FETCH_RECIPES_STARTED = 'FETCH_RECIPES_STARTED';
const FETCH_RECIPES_SUCCEEDED = 'FETCH_RECIPES_SUCCEEDED';
const FETCH_RECIPES_FAILED = 'FETCH_RECIPES_FAILED';
const SAVE_RECIPE_STARTED = 'SAVE_RECIPE_STARTED';
const SAVE_RECIPE_SUCCEEDED = 'SAVE_RECIPE_SUCCEEDED';
const SAVE_RECIPE_FAILED = 'SAVE_RECIPE_FAILED';

const reducer: (state: RecipesState, action: ActionProps) => RecipesState =
    (state, {type, payload}) => {
        switch (type) {
            case FETCH_RECIPES_STARTED:
                return { ...state, fetching: true, fetchingError: null };

            case FETCH_RECIPES_SUCCEEDED:
                return { ...state, recipes: payload.recipes, fetching: false };

            case FETCH_RECIPES_FAILED:
                return { ...state, fetchingError: payload.error, fetching: false};

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
    const [state, dispatch] = useReducer(reducer, initialState);
    const { recipes, fetching, fetchingError, saving, savingError } = state;

    useEffect(getRecipesEffect, []);
    useEffect(wsEffect, []);

    const saveRecipe = useCallback<SaveRecipeFn>(saveRecipeCallback, []);
    const value = { recipes, fetching, fetchingError, saving, savingError, saveRecipe };

    return (
        <RecipeContext.Provider value={value}>
            {children}
        </RecipeContext.Provider>
    );

    function getRecipesEffect() {
        let canceled = false;
        fetchRecipes();

        return () => {
            canceled = true;
        }

        async function fetchRecipes() {
            try {
                dispatch({ type: FETCH_RECIPES_STARTED });
                const recipes = await getRecipes();

                if (!canceled) {
                    dispatch({ type: FETCH_RECIPES_SUCCEEDED, payload: { recipes } });
                }
            } catch (error) {
                dispatch({ type: FETCH_RECIPES_FAILED, payload: { error } });
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
                savedRecipe = await createRecipe(recipe);
            }
            else {
                savedRecipe = await updateRecipe(recipe);
            }

            dispatch({ type: SAVE_RECIPE_SUCCEEDED, payload: { recipe: savedRecipe } });
        } catch (error) {
            dispatch({type: SAVE_RECIPE_FAILED, payload: {error}});
        }
    }

    function wsEffect() {
        let canceled = false;
        console.info("wsEffect - connecting");
        const closeWebSocket = newWebSocket(message => {
            if(canceled) {
                return;
            }

            const { event, payload: { recipe } } = message;
            console.info(`ws message, recipe ${event}`);
            if(event == 'created' || event == 'updated') {
                dispatch({type: SAVE_RECIPE_SUCCEEDED, payload: { recipe } });
            }
        });

        return () => {
            console.info("wsEffect - disconnecting");
            canceled = true;
            closeWebSocket();
        }
    }
};