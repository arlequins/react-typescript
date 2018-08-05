const whitelist = [
  'http://localhost',
  'http://localhost:5000',
]

export const Cors = {
  credentials: true,
  origin: (origin: any, callback: any) => {
      const originIsWhitelisted = whitelist.indexOf(origin) !== -1
      callback(null, originIsWhitelisted)
  },
  methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: 'accept, content-type',
}
