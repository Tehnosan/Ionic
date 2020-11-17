import {useState, useEffect} from 'react';
import { RecipeProps } from "./RecipeProps";
import { getRecipes } from "./recipeApi";
import Recipe from "./Recipe";

export interface RecipesState {
    recipes?: RecipeProps[],
    fetching: boolean,
    fetchingError?: Error,
}

export interface RecipesProps extends RecipesState{
    addRecipe: () => void,
}

export const useRecipes: () => RecipesProps = () => {
    const [state, setState] = useState<RecipesState>({
        recipes: undefined,
        fetching: false,
        fetchingError: undefined,
    });
    const {recipes, fetching, fetchingError } = state;

    const addRecipe = () => {
        let id;
        let newRecipes
        if(recipes){
            id = `${recipes.length + 1}`
            newRecipes = recipes.concat({id:id, name: `Recipe ${id}`});
        }

        setState({recipes:newRecipes, fetching: false, fetchingError: undefined});
    };

    useEffect(getRecipesEffect, []);

    return{
        recipes,
        fetching,
        fetchingError,
        addRecipe,
    };

    function getRecipesEffect() {
        let canceled = false;
        fetchRecipes();

        return () => {
            canceled = true;
        }
        
        async function fetchRecipes() {
            try {
                setState({...state, fetching: true});
                const recipes = await getRecipes();

                if(!canceled){
                    setState({...state, recipes: recipes, fetching: false});
                }
            }catch (error) {
                setState({...state, fetching: false, fetchingError: error});
            }
        }
    }
};