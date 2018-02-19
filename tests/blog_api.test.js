const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const { initialBlogs, nonExistingId, blogsInDb, usersInDb } = require('./test_helper')

describe('when there is initially one user at db', async () => {
    beforeAll(async () => {
        await User.remove({})
        const user = new User({ username: 'root', password: 'sekret' })
        await user.save()
    })

    test('POST /api/users succeeds with a fresh username', async () => {
        const usersBeforeOperation = await usersInDb()

        const newUser = {
            username: 'hanninev',
            name: 'Ville Hänninen',
            password: 'salaisuus',
            adult: true
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const usersAfterOperation = await usersInDb()
        expect(usersAfterOperation.length).toBe(usersBeforeOperation.length + 1)
        const usernames = usersAfterOperation.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test('POST /api/users fails with proper statuscode and message if username already taken', async () => {
        const usersBeforeOperation = await usersInDb()

        const newUser = {
            username: 'root',
            name: 'joku',
            password: 'salaisuus',
            adult: false
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body).toEqual({ error: 'username must be unique' })

        const usersAfterOperation = await usersInDb()
        expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
    })

    test('POST /api/users fails if password is too short', async () => {
        const usersBeforeOperation = await usersInDb()

        const newUser = {
            username: 'root12',
            name: 'kayttaja',
            password: 'sa',
            adult: false
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body).toEqual({ error: 'password must be at least 3 characters' })

        const usersAfterOperation = await usersInDb()
        expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
    })

    test('POST /api/users if field adult is empty, value is true', async () => {
        const usersBeforeOperation = await usersInDb()

        const newUser = {
            username: 'root12',
            name: 'kayttaja',
            password: 'saa'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(result.body.adult).toBe(true)

        const usersAfterOperation = await usersInDb()
        expect(usersAfterOperation.length).toBe(usersBeforeOperation.length + 1)
    })
})

describe('when there is initially some blogs saved', async () => {
    beforeAll(async () => {
        await Blog.remove({})

        const blogObjects = initialBlogs.map(b => new Blog(b))
        await Promise.all(blogObjects.map(b => b.save()))
    })

    test('all blogs are returned as json by /api/blogs', async () => {
        const blogsInDatabase = await blogsInDb()

        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(response.body.length).toBe(initialBlogs.length)

        const returnedTitles = response.body.map(b => b.title)
        blogsInDatabase.forEach(blog => {
            expect(returnedTitles).toContain(blog.title)
        })
    })

    test('specific blogs are returned as json by GET /api/blogs/:id', async () => {
        const blogsInDatabase = await blogsInDb()
        const aBlog = blogsInDatabase[0]
        console.log('/api/blogs/' + aBlog.id)

        const response = await api
            .get('/api/blogs/' + aBlog.id)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(response.body.title).toBe(aBlog.title)
    })
})

describe('addition of a new blog', async () => {

    test('a valid blog can be added ', async () => {
        const blogAtStart = await blogsInDb()

        const newBlog = {
            title: 'Testiotsikko',
            author: 'Jaakko Ojala',
            url: "https://testi.com/",
            likes: 0
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const blogsAfterOperation = await blogsInDb()

        expect(blogsAfterOperation.length).toBe(blogAtStart.length + 1)

        const titles = blogsAfterOperation.map(b => b.title)
        expect(titles).toContain('Testiotsikko')
    })

    test('if field likes are not given value, value is 0 ', async () => {
        const blogAtStart = await blogsInDb()

        const newBlog = {
            title: 'Testiotsikko',
            author: 'Jaakko Ojala',
            url: "https://testi.com/",
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const blogsAfterOperation = await blogsInDb()

        expect(blogsAfterOperation.length).toBe(blogAtStart.length + 1)

        const likes = blogsAfterOperation.map(b => b.likes)
        expect(likes[likes.length - 1]).toBe(0)
    })

    test('if field title or author are not given value, response is 400 ', async () => {
        const blogWhithoutTitle = {
            author: 'Jaakko Ojala',
            url: "https://testi.com/",
        }

        await api
            .post('/api/blogs')
            .send(blogWhithoutTitle)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const blogWhithoutAuthor = {
            title: 'Otsikko',
            url: "https://testi.com/",
        }

        await api
            .post('/api/blogs')
            .send(blogWhithoutAuthor)
            .expect(400)
            .expect('Content-Type', /application\/json/)
    })
})

afterAll(() => {
    server.close()
})
