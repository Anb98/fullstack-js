<template lang="pug">
	.modal.is-active
		.modal-background
		.modal-card
			header.modal-card-head
				p.modal-card-title Nuevo Producto
				button.delete(aria-label='close' @click='$emit("close")')
			section.modal-card-body
				.columns
					.field.column
						label.label SKU
						.control
							input.input(
								type='text'
								placeholder='SKU'
								v-model='data.SKU'
							)
					.field.column
						label.label Nombre
						.control
							input.input(
								type='text'
								placeholder='Lavadora'
								v-model='data.nombre'
							)

				.columns
					.field.column
						label.label Cantidad
						.control
							input.input(
								type='number'
								v-model='data.cantidad'
							)
					.field.column
						label.label Precio
						.control
							input.input(
								type='number'
								v-model='data.precio'
							)

				.columns
					.field.column
						label.label Descripcion
						.control
							input.input(
								type='text'
								placeholder='Descripcion'
								v-model='data.descripcion'
							)
					.file.column
						label.label Imagen
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


			footer.modal-card-foot
				button.button.is-success(@click='$emit("save", data)') Guardar
				button.button(@click='$emit("close")') Cancelar
</template>

<script>
import {
	ref,
} from '@vue/composition-api';

export default {
	setup() {
		const data = ref({
			SKU: '',
			nombre: '',
			cantidad: 0,
			precio: 0.00,
			descripcion: '',
			imagen: undefined,
		});

		const imageName = ref('');

		const loadImg = (e) => {
			const img = e.target.files;

			const reader = new FileReader();
			reader.readAsDataURL(img[0]);
			reader.onload = () => {
				data.value.imagen = reader.result;
				imageName.value = img[0].name;
			};
		};


		return {
			data,
			loadImg,
			imageName,
		};
	},
};
</script>

<style lang="stylus" scoped>
	label.label
		text-align left !important
</style>
