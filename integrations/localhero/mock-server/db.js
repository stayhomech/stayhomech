// unfortunately, categories are not the same for both locations.... wondering, if is still worth the time...
const categories = require('./data/categrories');
const bern = require('./data/bern');
const winterthur = require('./data/winterthur');

module.exports = () => ({
    categories,
    bern,
    winterthur
});
