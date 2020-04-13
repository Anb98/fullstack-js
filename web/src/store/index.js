import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		isLogged: false,
		token: '',
	},
	mutations: {
		login(state, token) {
			state.isLogged = true;
			state.token = token;
		},
		logout(state) {
			state.isLogged = false;
			state.token = '';
			localStorage.removeItem('jwt');
		},
	},
	actions: {
	},
	modules: {
	},
});
