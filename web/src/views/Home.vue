<template lang="pug">
	div
		MainTabs( @select='onSelect' )
		TableUser(v-if='selectedMenu==="Usuarios"')
		TableProducts(v-else)
</template>

<script>
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
	setup() {
		const selectedMenu = ref('Usuarios');

		const onSelect = (text) => {
			selectedMenu.value = text;
		};

		return { selectedMenu, onSelect };
	},
};
</script>
