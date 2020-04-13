<template lang="pug">
	.container
		ModalProduct(v-if='showModal' @close='showModal=false' @save='store')
		table.table
			tr
				th SKU
				th Nombre
				th Cantidad
				th Precio
				th Descripcion
				th Imagen
				th
					span(:style='{display: "inline-block", paddingRight:"1em"}') Acciones
					button.button.is-success.is-small(@click='showModal=true' title='Agregar producto')
						span.icon.is-small
							i.fas.fa-plus-square

			template(v-if='!isLoading && data')
				template(v-for='(item,i) of data.data')
					tr(:key='item.id' v-if='i!==editingRow.index' )
						td {{ item.attributes.SKU }}
						td {{ item.attributes.nombre }}
						td {{ item.attributes.cantidad }}
						td {{ item.attributes.precio }}
						td {{ item.attributes.descripcion }}
						td
							img(:src='item.attributes.imagen' :style='{height:"2.25em"}' )
						td
							p.buttons
								button.button.is-primary( @click='selectRow(item, i)' )
									span.icon.is-small
										i.fas.fa-pen
								button.button.is-danger( @click='destroy(item.id)' )
									span.icon.is-small
										i.fas.fa-trash
					tr(:key='item.id' v-else )
						td #[input.input(v-model='editingRow.attributes.SKU')]
						td #[input.input(v-model='editingRow.attributes.nombre')]
						td #[input.input(v-model='editingRow.attributes.cantidad' type='number')]
						td #[input.input(v-model='editingRow.attributes.precio' type='number')]
						td #[input.input(v-model='editingRow.attributes.descripcion')]
						td
							.file
								label.file-label
									input.file-input(
										type='file'
										name='resume'
										accept="image/*"
										@change='loadImg'
									)
									span.file-cta
										span.file-icon
											i.fas.fa-upload
										span.file-label {{imageName || 'Selecciona una imagen'}}

						td
							button.button.is-success(@click='save')
								span.icon.is-small
									i.fas.fa-save


			template(v-else)
				tr
					td(colspan='6')
						progress.progress.is-small.is-primary(max="100") 15%


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
import Pagination from 'vue-bulma-paginate';
import Swal from 'sweetalert2';

import { productsPath } from '@/config/paths';
import useDataApi from '@/hooks/useDataApi';
import ModalProduct from '@/components/ModalProduct.vue';

export default {
	components: {
		Pagination,
		ModalProduct,
	},
	setup(props, context) {
		const editingRow = ref({
			index: -1,
			id: '',
			attributes: {
				SKU: '',
				nombre: '',
				cantidad: 0,
				precio: 0.00,
				descripcion: '',
				imagen: '',
			},
		});
		const showModal = ref(false);

		const imageName = ref('');
		const token = computed(() => context.root.$store.state.token);


		const [state, fetchProducts] = useDataApi(productsPath);
		const [stateUpdate, updateProducts] = useDataApi(productsPath, { Authorization: `Bearer ${token.value}` });
		const page = computed(() => context.root.$route.query && context.root.$route.query.page || 1);

		const loadImg = (e) => {
			const img = e.target.files;

			const reader = new FileReader();
			reader.readAsDataURL(img[0]);
			reader.onload = () => {
				editingRow.value.attributes.imagen = reader.result;
				imageName.value = img[0].name;
			};
		};

		const selectRow = (item, index) => {
			editingRow.value = {
				id: item.id,
				attributes: {
					SKU: item.attributes.SKU,
					nombre: item.attributes.nombre,
					cantidad: item.attributes.cantidad,
					precio: item.attributes.precio,
					descripcion: item.attributes.descripcion,
				},
				index,
			};
		};

		const save = () => {
			updateProducts({
				url: `${productsPath}/${editingRow.value.id}`,
				body: {
					data: {
						id: editingRow.value.id,
						type: 'products',
						attributes: editingRow.value.attributes,
					},
				},
				method: 'patch',
			});
		};

		const destroy = (id) => {
			Swal.fire({
				title: 'Confirmación',
				text: '¿Está seguro que desea eliminar el producto?',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Sí',
			}).then((result) => {
				if (result.value) {
					updateProducts({
						url: `${productsPath}/${id}`,
						method: 'delete',
					});
				}
			});
		};

		const store = (data) => {
			updateProducts({
				url: `${productsPath}`,
				body: {
					data: {
						type: 'products',
						attributes: data,
					},
				},
				method: 'post',
			});
		};


		watch(page, (val) => {
			fetchProducts({
				params: {
					'page[offset]': (val - 1) * 10,
				},
			});
		});

		watch(stateUpdate.status, (newVal) => {
			console.log('setup -> newVal', newVal);
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

				fetchProducts({
					params: {
						'page[offset]': (page.value - 1) * 10,
					},
				});

				showModal.value = false;
				editingRow.value = {
					index: -1,
					id: '',
					attributes: {
						SKU: '',
						nombre: '',
						cantidad: 0,
						precio: 0.00,
						descripcion: '',
						imagen: '',
					},
				};
			}
		});

		return {
			page,
			...state,
			imageName,
			editingRow,
			loadImg,
			save,
			selectRow,
			destroy,
			store,
			showModal,
		};
	},
};
</script>
