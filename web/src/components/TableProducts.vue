<template lang="pug">
	.container
		table.table
			tr
				th SKU
				th Nombre
				th Cantidad
				th Precio
				th Descripcion
				th Imagen
				th Acciones

			template(v-if='!state.isLoading.value && state.data.value')
				template(v-for='(item,i) of state.data.value.data')
					tr(:key='item.id' v-if='i!==editingRow.index' )
						td {{ item.attributes.SKU }}
						td {{ item.attributes.nombre }}
						td {{ item.attributes.cantidad }}
						td {{ item.attributes.precio }}
						td {{ item.attributes.descripcion }}
						td {{ item.attributes.imagen }}
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
import { productsPath } from '@/config/paths';
import useDataApi from '@/hooks/useDataApi';
import Pagination from 'vue-bulma-paginate';

export default {
	components: {
		Pagination,
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
			updateProducts({
				url: `${productsPath}/${id}`,
				method: 'delete',
			});
		};


		onMounted(() => {
			fetchProducts();
		});

		watch(stateUpdate.status, (newVal) => {
			if (newVal === 200) {
				fetchProducts();
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
			state,
			imageName,
			editingRow,
			loadImg,
			save,
			selectRow,
			destroy,
		};
	},
};
</script>
