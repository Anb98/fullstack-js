<template lang='pug' >
	#app
		router-view(v-if='!loading')
		span(v-else) Cargando...
</template>

<script>
import {
	onBeforeMount, ref, watch, computed,
} from '@vue/composition-api';
import { verifyTokenPath } from '@/config/paths';
import axios from 'axios';

export default {
	setup(props, context) {
		const loading = ref(true);
		const permitedRoute = ref('');
		const actualPath = computed(() => context.root.$route.name);

		const getToken = async () => {
			const token = localStorage.getItem('jwt');
			if (!token) {
				context.root.$router.push('/login');
				permitedRoute.value = 'Login';
				return;
			}

			const result = await axios(verifyTokenPath, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
				method: 'post',
			});

			if (result.status === 200) {
				context.root.$store.commit('login', token);
				permitedRoute.value = 'Home';

				if (context.root.$route.name === 'Home') {
					loading.value = false;
				} else {
					context.root.$router.replace('/');
				}
			} else {
				context.root.$router.push('/login');
				permitedRoute.value = 'Login';
				localStorage.removeItem('jwt');
			}
		};

		watch(actualPath, () => {
			if (permitedRoute.value === actualPath.value) { loading.value = false; }
		});

		onBeforeMount(() => {
			getToken();
		});

		return {
			loading,
		};
	},
};
</script>

<style lang="stylus">
#app
  font-family Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50
  margin-top 60px
</style>
