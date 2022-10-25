import { LOAD_ITEMS, REMOVE_ITEM, ADD_ITEM } from "./items";

const LOAD = "pokemon/LOAD";
const LOAD_TYPES = "pokemon/LOAD_TYPES";
const ADD_ONE = "pokemon/ADD_ONE";

const load = (list) => ({
	type: LOAD,
	list,
});

const loadTypes = (types) => ({
	type: LOAD_TYPES,
	types,
});

const addOnePokemon = (pokemon) => ({
	type: ADD_ONE,
	pokemon,
});
//thunk action creator
export const getPokemon = () => async (dispatch) => {
	const response = await fetch(`/api/pokemon`);

	if (response.ok) {
		const list = await response.json();
		dispatch(load(list));
	}
};

// get by Pokemon by ID
export const getPokemonByID = (id) => async (dispatch) => {
	const response = await fetch(`/api/pokemon/${id}`);

	if (response.ok) {
		const pokemon = await response.json();
		dispatch(addOnePokemon(pokemon));
	}
};

// Create Pokemon
export const createPokemon = (pokemon) => async (dispatch) => {
	const response = await fetch("/api/pokemon", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(pokemon),
	});

	if (response.ok) {
		const pokemon = await response.json();
		console.log(pokemon);
		dispatch(addOnePokemon(pokemon));
		return pokemon; // NEED TO RETURN HERE!!
	}
};

// EDIT Pokemon
export const editPokemon = (id, pokemon) => async (dispatch) => {
	const response = await fetch(`/api/pokemon/${id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(pokemon),
	});

	if (response.ok) {
		const pokemon = await response.json();
		console.log(pokemon);
		dispatch(addOnePokemon(pokemon));
		return pokemon;
	}
};

export const getPokemonTypes = () => async (dispatch) => {
	const response = await fetch(`/api/pokemon/types`);

	if (response.ok) {
		const types = await response.json();
		dispatch(loadTypes(types));
	}
};

const initialState = {
	list: [],
	types: [],
};

const sortList = (list) => {
	return list
		.sort((pokemonA, pokemonB) => {
			return pokemonA.number - pokemonB.number;
		})
		.map((pokemon) => pokemon.id);
};

const pokemonReducer = (state = initialState, action) => {
	switch (action.type) {
		case LOAD:
			const allPokemon = {};
			action.list.forEach((pokemon) => {
				allPokemon[pokemon.id] = pokemon;
			});
			return {
				...allPokemon,
				...state,
				list: sortList(action.list),
			};
		case LOAD_TYPES:
			return {
				...state,
				types: action.types,
			};
		case ADD_ONE:
			if (!state[action.pokemon.id]) {
				const newState = {
					...state,
					[action.pokemon.id]: action.pokemon,
				};
				const pokemonList = newState.list.map((id) => newState[id]);
				pokemonList.push(action.pokemon);
				newState.list = sortList(pokemonList);
				return newState;
			}
			return {
				...state,
				[action.pokemon.id]: {
					...state[action.pokemon.id],
					...action.pokemon,
				},
			};
		case LOAD_ITEMS:
			return {
				...state,
				[action.pokemonId]: {
					...state[action.pokemonId],
					items: action.items.map((item) => item.id),
				},
			};
		case REMOVE_ITEM:
			return {
				...state,
				[action.pokemonId]: {
					...state[action.pokemonId],
					items: state[action.pokemonId].items.filter(
						(itemId) => itemId !== action.itemId
					),
				},
			};
		case ADD_ITEM:
			console.log(action.item);
			return {
				...state,
				[action.item.pokemonId]: {
					...state[action.item.pokemonId],
					items: [...state[action.item.pokemonId].items, action.item.id],
				},
			};
		default:
			return state;
	}
};

export default pokemonReducer;

// CSS
// ✅ All links, buttons, input fields, and text features on the site are functioning properly and belong to the features that were worked on
// ✅ The alignment / justification of each element is consistent with the target cloned site
// ✅ The colors used on each element are comparable with the target cloned site or within professional standards
// ✅ The fonts & font sizes used on each element are comparable with the target cloned site
// ✅ Google Fonts or the built-in browser fonts must be used for fonts
// ✅ Your site has no glaring visual issues on a standard size laptop (needs to be a desktop version of the target cloned site - 1024px)
// ✅ The logo and name of your application are different from the target cloned site
// ✅ Your document page title and application's favicon match that of the name and the logo of your application
// ✅ The white spacing (padding, margin, border, and positioning) of each element are consistent with the target cloned site
// ✅ The box-shadows of each element are consistent with the target cloned site
// ✅ The buttons are consistent with the target cloned site
// ✅ The menus are consistent with the target cloned site
// ✅ The mouse-pointers are consistent with industry standards
// ✅ The hover effects on each element are consistent with the target cloned site
// ✅ The icons used are comparable with the target cloned site
// ✅ FontAwesome must be used for icons
