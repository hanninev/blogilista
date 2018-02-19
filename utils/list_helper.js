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

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}