<template>
	<div class="field">
		<label class="label">Username</label>
		<div class="control has-icons-left has-icons-right">
			<input class="input is-success" type="text" placeholder="Text input" value="bulma">
			<span class="icon is-small is-left">
				<i class="fas fa-user"></i>
			</span>
			<span class="icon is-small is-right">
				<i class="fas fa-check"></i>
			</span>
		</div>
		<p>{{state}}</p>
	</div>
</template>

<script>
import { onMounted } from '@vue/composition-api';
import useDataApi from '../hooks/useDataApi';

export default {
	name: 'about',
	setup() {
		const [state, fetchUsers] = useDataApi('http://localhost:3000/products');

		onMounted(() => {
			fetchUsers();
		});

		return { state };
	},
};
</script>
