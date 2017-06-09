export default class {
    // get books
    @RequestUrl('/api/books', RequestUrl.POST)
    @RequestParam('userId', 'required', '书名')
    async getBooks(ctx, next) {
        ctx.body = 'books list'
    }
}