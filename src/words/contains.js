module.exports = contains = (target, list) => {
    let value = 0;
    list.forEach(word => {
        value = value + target.includes(word);
    });
    return (value > 0)
}