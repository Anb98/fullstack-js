<template lang="pug">
	.container
		form
			h1.title Login
			.field
				label.label Email
				.control
					input.input(type='email', placeholder='example@gmail.com' v-model='credentials.username' )
			.field
				label.label Password
				.control
					input.input(type='password', placeholder='password' v-model='credentials.password')

			button.button.is-fullwidth.is-primary(
				@click.prevent='signin'
				:class='{"is-loading":isLoading}'
			) Iniciar sesion
</template>

<script>
import { ref, watchEffect } from '@vue/composition-api';
import useDataApi from '@/hooks/useDataApi';

export default {
	name: 'Login',
	setup(props, context) {
		const credentials = ref({
			username: '',
			password: '',
		});

		const [state, fetchLogin] = useDataApi('http://localhost:3000/auth/login');

		const signin = () => {
			fetchLogin({
				body: credentials.value,
				method: 'post',
			});
		};

		watchEffect(() => {
			if (state.status.value === 200) {
				context.root.$router.push('/');
				localStorage.setItem('jwt', state.data.value.token);
			}

			if (state.status === 400) { alert('fail'); }
		});

		return {
			credentials,
			signin,
			isLoading: state.isLoading,
		};
	},
};
</script>

<style lang="stylus" scoped>
.container
	display flex;
	justify-content center;
	align-items center;

	form
		width 20em
		text-align left
		border 2px solid #ecf0f1
		border-radius 10px
		padding 2em
		box-shadow 6px 6px 0px 0px rgba(0,0,0,0.46)

</style>
