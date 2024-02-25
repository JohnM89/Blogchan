const helpers = {
    format_date: (date) => {
        return date.toLocaleDateString();
    },
    format_amount: (amount) => {
        return parseInt(amount).toLocaleString();
    },
    get_emoji: () => {
        const randomNum = Math.random();

        // return a random emoji
        if (randomNum > 0.9) {
            return `<span for="img" aria-label="lightbulb">💡</span>`;
        } else if (randomNum > 0.8) {
            return `<span for="img" aria-label="laptop">💻</span>`;
        } else if (randomNum > 0.7) {
            return `<span for="img" aria-label="gear">⚙️</span>`;
        } else if (randomNum > 0.6) {
            return `<span for="img" aria-label="rocket">🚀</span>`;
        } else if (randomNum > 0.5) {
            return `<span for="img" aria-label="heart">❤️</span>`;
        } else if (randomNum > 0.4) {
            return `<span for="img" aria-label="thumbs-up">👍</span>`;
        } else if (randomNum > 0.3) {
            return `<span for="img" aria-label="smile">😊</span>`;
        } else if (randomNum > 0.2) {
            return `<span for="img" aria-label="fire">🔥</span>`;
        } else if (randomNum > 0.1) {
            return `<span for="img" aria-label="star">⭐️</span>`;
        } else {
            return `<span for="img" aria-label="coffee">☕️</span>`;
        }
    },
};

module.exports = helpers;
