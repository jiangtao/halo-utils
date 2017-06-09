export default class {
    // get books
    @RequestUrl('/api/books', RequestUrl.POST)
    @RequestParam('userId', 'required', 'user id')
    async getBooks(ctx, next) {
        ctx.body = 'books list'
    }
    
    // get book info
    @RequestUrl('/api/book/:id', RequestUrl.GET)
    async getBookInfo(ctx, next) {
        ctx.body = 'return book'
    }
}