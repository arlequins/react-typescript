const baseUrl = process.env.BASE_URL !== undefined ? process.env.BASE_URL : 'http://localhost:3000'

export const Origin = {
  root: baseUrl,
  app: `${baseUrl}`,
  path: '/',
}
