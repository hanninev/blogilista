const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, blog) => {
        return sum + blog.likes
    }
    return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    function compare(a, b) {
        if (a.likes < b.likes) {
            return 1
        } else if (a.likes > b.likes) {
            return -1
        } else {
            return 0
        }
    }
    blogs.sort(compare)
    return blogs[0]
}

const orderAuthorsByBlogCount = (blogs) => {
    const result = blogs
        .reduce((authors, line) => {
            authors[line.author] = authors[line.author] || 0
            authors[line.author] += 1
            return authors
        }, {})
    return Object.entries(result)
        .map(a => {
            return { author: a[0], blogs: a[1] }
        })
        .sort((a, b) => b.blogs - a.blogs)
}

const mostBlogs = (blogs) => {
    return orderAuthorsByBlogCount(blogs)[0]
}

const orderAuthorsByBlogLikes = (blogs) => {
    const result = blogs
        .reduce((authors, line) => {
            const likes = line.likes
            authors[line.author] = authors[line.author] || 0
            authors[line.author] += likes
            return authors
        }, {})
    return Object.entries(result)
        .map(a => {
            return { author: a[0], likes: a[1] }
        })
        .sort((a, b) => b.likes - a.likes)
}

const mostLikes = (blogs) => {
    return orderAuthorsByBlogLikes(blogs)[0]
}


module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}