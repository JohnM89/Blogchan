
//utility to get image URLs
function getImageUrls() {
    return [
        '/assets/alex.jpg',
        '/assets/alexa.jpg',
        '/assets/ben.jpg',
        '/assets/flag.jpg',
        '/assets/just.jpg',
        '/assets/mike.jpg',
        '/assets/news.jpg',
        '/assets/olivo.jpg',
        '/assets/pat.jpg',
        '/assets/roman.jpg',
    ];
}


const helpers = {
    format_date: (date) => {
    if (!date) return '';
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
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

        truncate: (str, len) => {
        if (str && str.length > len) {
            return str.substring(0, len) + '...';
        }
        return str;
    },


isEven: function(index) {
    return (index % 2) === 0;
},

// append images to an array to apply them in the DOM
appendImages: function() {
    const imageUrls = getImageUrls();
    let result = [];
    // for loop to add images to the array
    for (let i = 0; i < 1; i++) {
        const randomIndex = Math.floor(Math.random() * imageUrls.length);
        result.push({ src: imageUrls[randomIndex] });
    }
    return result;
}
    
    };
module.exports = helpers;