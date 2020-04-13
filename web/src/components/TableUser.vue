<template lang="pug">
	div.container
		ModalUser(v-if='showModal' @close='showModal=false' @save='store')
		table.table
			tr
				th Nombre
				th Username
				th Email
				th Telefono
				th Fecha nacimiento
				th
					span(:style='{display: "inline-block", paddingRight:"1em"}') Acciones
					button.button.is-success.is-small(@click='showModal=true' title='Agregar usuario')
						span.icon.is-small
							i.fas.fa-plus-square

			template(v-if='!isLoading && data')
				template(v-for='(item,i) of data.data')
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
			tr
				td(colspan=6)
					Pagination(
						:currentPage='Number(page)'
						:itemsPerPage='data? data.meta.pagination.limit : 10'
						:itemsTotal='data? data.meta.pagination.total : 0'
						:buttonsMax='5'
						:url="$route.name"
						nextText='Siguiente'
						previousText='Anterior'
					)

</template>

<script>
import {
	computed, ref, watch,
} from '@vue/composition-api';
import Swal from 'sweetalert2';
import Pagination from 'vue-bulma-paginate';

import useDataApi from '@/hooks/useDataApi';
import { usersPath } from '@/config/paths';
import ModalUser from '@/components/ModalUser.vue';

export default {
	components: {
		Pagination,
		ModalUser,
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
		const showModal = ref(false);
		const token = computed(() => context.root.$store.state.token);

		const [state, fetchUsers] = useDataApi(usersPath);
		const [stateUpdate, updateUsers] = useDataApi(usersPath, { Authorization: `Bearer ${token.value}` });
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

		const store = (data) => {
			updateUsers({
				url: `${usersPath}`,
				body: {
					data: {
						type: 'users',
						attributes: data,
					},
				},
				method: 'post',
			});
		};

		const destroy = (id) => {
			Swal.fire({
				title: 'Confirmación',
				text: '¿Está seguro que desea eliminar el usuario?',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Sí',
			}).then((result) => {
				if (result.value) {
					updateUsers({
						url: `${usersPath}/${id}`,
						method: 'delete',
					});
				}
			});
		};


		watch(page, (val) => {
			fetchUsers({
				params: {
					'page[offset]': (val - 1) * 10,
				},
			});
		});

		watch(stateUpdate.status, (newVal) => {
			if (newVal === 200 || newVal === 201) {
				if (!stateUpdate.data.value.data) {
					Swal.fire({
						toast: true,
						title: 'Eliminado con exito!',
						timer: 3000,
						showConfirmButton: false,
						position: 'top-end',
						icon: 'success',
					});
				} else {
					Swal.fire({
						toast: true,
						title: 'Guardado con exito!',
						timer: 3000,
						showConfirmButton: false,
						position: 'top-end',
						icon: 'success',
					});
				}


				fetchUsers({
					params: {
						'page[offset]': (page.value - 1) * 10,
					},
				});

				showModal.value = false;
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
			} else if (newVal === 409) {
				if (stateUpdate.error.value?.errors[0].detail.includes('index: username_1 dup key')) {
					Swal.fire({
						toast: true,
						title: `El username ingresado ya existe`,
						timer: 3000,
						showConfirmButton: false,
						position: 'top-end',
						icon: 'warning',
					});
				} else if (stateUpdate.error.value?.errors[0].detail.includes('index: email_1 dup key')) {
					Swal.fire({
						toast: true,
						title: `El email ingresado ya existe`,
						timer: 3000,
						showConfirmButton: false,
						position: 'top-end',
						icon: 'warning',
					});
				} else {
					Swal.fire({
						toast: true,
						title: stateUpdate.error.value?.errors[0].detail.details[0].message,
						timer: 3000,
						showConfirmButton: false,
						position: 'top-end',
						icon: 'warning',
					});
				}
			}
		});

		return {
			...state,
			page,
			save,
			editingRow,
			selectRow,
			destroy,
			showModal,
			store,
		};
	},
};
</script>
