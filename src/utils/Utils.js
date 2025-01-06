
const arrayShuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        // Generate a random index between 0 and i
        const randomIndex = Math.floor(Math.random() * (i + 1));

        // Swap the current element with the randomly chosen element
        [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    }
    return array;
};


// Returns an array consisting of true/false values based on the truthiness of the corresponding elements in the input arrays
const arrayOR = (a, b) => {
    if (a.length !== b.length) {
        throw new Error("Both arrays must have the same length");
    }
    return a.map((value, index) => value || b[index]);
}


export {
    arrayShuffle,
};

