<template lang="pug">
	.modal.is-active
		.modal-background
		.modal-card
			header.modal-card-head
				p.modal-card-title Nuevo Usuario
				button.delete(aria-label='close' @click='$emit("close")')
			section.modal-card-body
				.columns
					.field.column
						label.label Nombre
						.control
							input.input(
								type='text'
								placeholder='nombre'
								v-model='data.nombre'
							)
					.field.column
						label.label Username
						.control
							input.input(
								type='text'
								placeholder='username'
								v-model='data.username'
							)

				.columns
					.field.column
						label.label Email
						.control
							input.input(
								type='Text'
								v-model='data.email'
							)
					.field.column
						label.label Telefono
						.control
							input.input(
								type='number'
								v-model.number='data.telefono'
							)

				.columns
					.field.column
						label.label Password
						.control
							input.input(
								type='password'
								placeholder='password'
								v-model='data.password'
							)
					.field.column
						label.label Fecha nacimiento
						.control
							input.input(
								type='date'
								v-model='data.fecha_nacimiento'
							)


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
			nombre: '',
			username: '',
			email: '',
			telefono: '',
			fecha_nacimiento: undefined,
			password: '',
		});

		return {
			data,
		};
	},
};
</script>

<style lang="stylus" scoped>
	label.label
		text-align left !important
</style>
