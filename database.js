/**
 * Database queries.
 * @module Database/queries
 */
module.exports = {
	/**
	* Returns the number of active users in the system from database.
	* @param {connection} conn - Database connection.
	* @returns {array} arr - List users in database.
	*/
	numUsers: async function(conn){
		let a = `SELECT id FROM mybd.users`;
		let arr = [];
		const [rows,fields] = await conn.execute(a);
		for (let i = 0; i < rows.length; i++) { // выведет 0, затем 1, затем 2
			arr.push(""+rows[i].id);
		}
		return arr;
	},
	/**
	* Returns interfaces for a definite user from database.
	* @param {connection} conn - Database connection.
	* @param {number} id - User ID of which to return interfaces.
	* @returns {array} arr - List user interfaces.
	*/
	getInterfaces: async function(conn, id){
		let c = `SELECT * FROM mybd.users WHERE id=${id}`;
		let arr = [];
		const [rows1,fields1] =  await conn.execute(c);
		console.log(rows1);
		if(rows1[0].LTE == 1){
			arr.push("LTE");
		}
		if(rows1[0].LoRa==1){
			arr.push("LoRa");
		}
		if(rows1[0].WiFi==1)
		{
			arr.push("WiFi");
		}
		return arr;
	},
	
	/**
	* Writes a log to the database.
	* @param {connection} conn - Database connection.
	* @param {string} time - Current date and time.
	* @param {number} id - User ID.
	* @param {string} nameInt - Interface name.
	* @param {string} CurMes - Sent message.
	*/
	Log: async function(conn, time, id, nameInt, CurMes){
		let d = `Insert into mybd.log(Moment, IdUser, Interface, Message) values ('${time}', ${id}, '${nameInt}', '${CurMes}')`;
		await conn.execute(d);
	},
	/**
	* Returns a list of users in the system. 
	* @param {connection} conn - Database connection.
	* @returns {array} arr - List users.
	*/
	getId: async function(conn){
		let a = `SELECT id FROM mybd.users`;
		let arr = [];
		const [rows,fields] = await conn.execute(a);
		for (let i = 0; i < rows.length; i++) { // выведет 0, затем 1, затем 2
			arr.push(""+rows[i].id);
		}
		return arr;
	},
	/**
	* Returns the ip address and port of the user.
	* @param {connection} conn - Database connection.
	* @param {string} Interface - Interface name.
	* @param {number} Id - User ID.
	* @returns {array} arr - User ip address and port.
	*/
	getIp:async function(conn, Interface, Id){
		let d = `SELECT * FROM mybd.${Interface} WHERE IdUser = ${Id}`;
		const [rows,fields] = await conn.execute(d);
		//console.log(rows);
		let arr = [];
		console.log(rows[0].IpIn);
		arr.push(rows[0].IpIn);
		arr.push(rows[0].Port);
		return arr;
	},
	/**
	* Add user to database.
	* @param {connection} conn - Database connection.
	* @param {number} id - User ID.
	* @param {number} Lora - Presence of a LoRa interface.
	* @param {number} LTE - Presence of a LTE interface.
	* @param {number} Wifi - Presence of a Wi-Fi interface.
	* @param {number} ip1 - External user ip address.
	* @param {number} ip2 - Interior user ip address.
	* @param {number} port - User port.
	*/
	Add: async function(conn, id, Lora, Wifi, LTE, ip1, ip2, port){
		let d = `Insert into mybd.users(Id, LTE, LoRa, WiFi) values (${id}, ${LTE}, ${Lora}, ${Wifi})`;
		console.log("id: "+id +" ip1: "+ ip1 +" ip2: "+ip2+" lora: "+Lora+" lte: "+LTE+" wifi: "+Wifi);
		await conn.execute(d);
		if(Lora ==1){
			let c = `Insert into mybd.LoRa(IdUser, IpIn, IpOut, Port) values ('${id}', '${ip1}', '${ip2}', '${port}')`;
			await conn.execute(c);
		}
		if(Wifi ==1){
			let c = `Insert into mybd.WiFi(IdUser, IpIn, IpOut, Port) values ('${id}', '${ip1}', '${ip2}', '${port}')`;
			await conn.execute(c);
		}
		if(LTE ==1){
			let c = `Insert into mybd.LTE(IdUser, IpIn, IpOut, Port) values ('${id}', '${ip1}', '${ip2}', '${port}')`;
			await conn.execute(c);
		}
	},
	/**
	* Delete user from database.
	* @param {connection} conn - Database connection.
	* @param {number} id - User ID.
	*/
	Delete: async function(conn, id){
		let arr = [];
		let a = `SELECT * FROM mybd.users WHERE id=${id}`;
		const [rows1,fields1] =  await conn.execute(a);
		console.log(rows1);
		if(rows1[0].LTE == 1){
			let d1 = `SELECT * FROM mybd.LTE WHERE IdUser=${id}`;
			const [rows2,fields2] =  await conn.execute(d1);
			console.log(rows2);
			arr.push(""+rows2[0].IpIn);
			arr.push(""+rows2[0].IpOut);
			let d = `Delete FROM mybd.LTE where IdUser= ${id}`;
			await conn.execute(d);
		}
		if(rows1[0].LoRa==1){
			if(rows1[0].LTE == 0){
				let d1 = `SELECT * FROM mybd.LoRa WHERE IdUser=${id}`;
				const [rows2,fields2] =  await conn.execute(d1);
				console.log(rows2);
				arr.push(""+rows2[0].IpIn);
				arr.push(""+rows2[0].IpOut);
			}
		
			let e = `Delete FROM mybd.LoRa where IdUser= ${id}`;
			await conn.execute(e);
			
		}
		if(rows1[0].WiFi==1)
		{
			if(rows1[0].LTE == 0 && rows1[0].LoRa == 0){
				let d1 = `SELECT * FROM mybd.WiFi WHERE IdUser=${id}`;
				const [rows2,fields2] =  await conn.execute(d1);
				console.log(rows2);
				arr.push(""+rows2[0].IpIn);
				arr.push(""+rows2[0].IpOut);
			}
			let c = `Delete FROM mybd.WiFi where IdUser= ${id}`;
			await conn.execute(c);
		}
		let k = `Delete FROM mybd.users where Id= ${id}`;
		await conn.execute(k);
		console.log(arr);
		return arr;
	}
};
