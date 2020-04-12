<template lang="pug">
	.tabs.is-boxed
		ul
			li(
				v-for='(item, i) of menu'
				:key='i'
				:class='{"is-active":item.isSelected}'
				@click='selectItem(i)'
			)
				a
					span.icon.is-small
						i(:class='item.icon')
					span {{item.text}}
</template>

<script>
import { ref, computed } from '@vue/composition-api';

export default {
	setup(props, context) {
		const menu = ref([
			{ text: 'Usuarios', isSelected: true, icon: 'fas fa-users' },
			{ text: 'Productos', isSelected: false, icon: 'fas fa-box-open' },
		]);

		const selectedIndex = computed(() => menu.value.findIndex((el) => el.isSelected));

		const selectItem = (index) => {
			menu.value[selectedIndex.value].isSelected = false;
			menu.value[index].isSelected = true;
			context.emit('select', menu.value[index].text);
		};

		return {
			menu,
			selectItem,
		};
	},
};
</script>
