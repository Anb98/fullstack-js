const server = require('./app');
const mongoose           = require('mongoose');
const {db, port, domain } = require('./config');

mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
	.then(res=>{
		server.listen(port, ()=>{
			console.log(`Server runnig on http://${domain}:${port}`);
		});
	})
	.catch(err=>console.log('Error de conexion a mongodb',err));