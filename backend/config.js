module.exports = {
	name: 'API',
	env: process.env.NODE_ENV || 'development',
	port: process.env.PORT || 3000,
	base_url: process.env.BASE_URL || 'http://localhost:3000',
	db: {
		uri: process.env.MONGODB_URI || 'mongodb://yukodbadmin:yukoyuko@127.0.0.1:28017/yuko',
	},
}
