<template lang="pug">
	div.container
		table.table
			tr
				th Nombre
				th Username
				th Email
				th Telefono
				th Fecha nacimiento
				th Acciones

			template(v-if='!state.isLoading.value && state.data.value')
				template(v-for='(item,i) of state.data.value.data')
					tr(:key='item.id' v-if='i!==editingRow.index' )
						td {{ item.attributes.nombre }}
						td {{ item.attributes.username }}
						td {{ item.attributes.email }}
						td {{ item.attributes.telefono }}
						td {{ item.attributes.fecha_nacimiento }}
						td
							p.buttons
								button.button.is-primary( @click='selectRow(item, i)' )
									span.icon.is-small
										i.fas.fa-pen
								button.button.is-danger( @click='destroy(item.id)' )
									span.icon.is-small
										i.fas.fa-trash
					tr(:key='item.id' v-else )
						td #[input.input(v-model='editingRow.attributes.nombre')]
						td #[input.input(v-model='editingRow.attributes.username')]
						td #[input.input(v-model='editingRow.attributes.email' type='email')]
						td #[input.input(v-model='editingRow.attributes.telefono' type='number')]
						td #[input.input(v-model='editingRow.attributes.fecha_nacimiento' type='date')]
						td
							button.button.is-success(@click='save')
									span.icon.is-small
										i.fas.fa-save

			template(v-else)
				tr
					td(colspan='6')
						progress.progress.is-small.is-primary(max="100") 15%


		Pagination(
			:currentPage='page'
			:itemsPerPage='10'
			:itemsTotal='100'
			:buttonsMax='5'
			:url="$route.name"
			nextText='Siguiente'
			previousText='Anterior'
		)
</template>

<script>
import {
	computed, onMounted, ref, watch,
} from '@vue/composition-api';
import useDataApi from '@/hooks/useDataApi';
import Pagination from 'vue-bulma-paginate';

import { usersPath } from '@/config/paths';

export default {
	components: {
		Pagination,
	},
	setup(props, context) {
		const editingRow = ref({
			index: -1,
			id: '',
			attributes: {
				nombre: '',
				username: '',
				email: '',
				telefono: 0,
				fecha_nacimiento: '',
			},
		});

		const [state, fetchUsers] = useDataApi(usersPath);
		const [stateUpdate, updateUsers] = useDataApi();
		const page = computed(() => context.root.$route.query && context.root.$route.query.page || 1);

		const selectRow = (item, index) => {
			editingRow.value = {
				id: item.id,
				attributes: {
					nombre: item.attributes.nombre,
					username: item.attributes.username,
					email: item.attributes.email,
					telefono: item.attributes.telefono,
					fecha_nacimiento: item.attributes.fecha_nacimiento,
				},
				index,
			};
		};

		const save = () => {
			updateUsers({
				url: `${usersPath}/${editingRow.value.id}`,
				body: {
					data: {
						id: editingRow.value.id,
						type: 'users',
						attributes: editingRow.value.attributes,
					},
				},
				method: 'patch',
			});
		};

		const destroy = (id) => {
			updateUsers({
				url: `${usersPath}/${id}`,
				method: 'delete',
			});
		};

		onMounted(() => {
			fetchUsers();
		});

		watch(stateUpdate.status, (newVal) => {
			if (newVal === 200) {
				fetchUsers();
				editingRow.value = {
					index: -1,
					id: '',
					attributes: {
						nombre: '',
						username: '',
						email: '',
						telefono: 0,
						fecha_nacimiento: '',
					},
				};
			}
		});

		return {
			page,
			state,
			save,
			editingRow,
			selectRow,
			destroy,
		};
	},
};
</script>
