<template lang="pug">
	div
		button.button.is-warning.is-small(@click='signout')
			span.icon.is-small
				i.fas.fa-sign-out-alt
			span Cerrar sesion
		MainTabs( @select='onSelect' )
		TableUser(v-if='selectedMenu==="Usuarios"')
		TableProducts(v-else)
</template>

<script>
import Swal from 'sweetalert2';
import { ref } from '@vue/composition-api';
import MainTabs from '@/components/MainTabs.vue';
import TableUser from '@/components/TableUser.vue';
import TableProducts from '@/components/TableProducts.vue';

export default {
	name: 'Home',
	components: {
		MainTabs,
		TableUser,
		TableProducts,
	},
	setup(props, context) {
		const selectedMenu = ref('Usuarios');

		const onSelect = (text) => {
			selectedMenu.value = text;

			if (context.root.$route.query.page) {
				context.root.$router.replace({
					path: '/',
					query: {},
				});
			}
		};

		const signout = () => {
			Swal.fire({
				title: 'Confirmación',
				text: '¿Está seguro que cerrar sesion?',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Sí',
			}).then((result) => {
				if (result.value) {
					context.root.$store.commit('logout');
					context.root.$router.replace('/login');
				}
			});
		};

		return { selectedMenu, onSelect, signout };
	},
};
</script>
