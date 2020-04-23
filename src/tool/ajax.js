import axios from 'axios'

let install = axios.create()
export default class Axios {
	static ajax (method = 'GET', url, data) {
	// 从localStorage中读取token
	let baseApi = '';
	return new Promise((resolve, reject) => {
		let requestData = {
			baseURL: baseApi,
			headers: {
				"Content-Type": "application/json"
			},
			method,
			url
		}
		if (data) {
			requestData['data'] = data
		}
		if (method === 'GET' && data) {
			requestData['params'] = data
		}
		// if (window.localStorage.getItem('token')) {
		// 	requestData['headers']['token'] = `${window.localStorage.getItem('token')}`
		// }
		install(requestData)
			.then(response => {
				if (response.status !== 200) reject(response)
				let res = response.data
				if (res.code == 1000) {
					resolve(res.data)
				} else {
					reject(res)
				}
			})
			.catch(err => {
				if (err && err.response && err.response.status && err.response.status === 401) {
					global.location.href = '/'
				} else {
					reject({
						message: '服务器产生错误'
					})
					// reject(err.response)
				}
			})
	})
}
}