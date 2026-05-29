let movies = [];

fetch("movies.csv")
    .then(response => response.text())
    .then(text => {
        const rows = text.trim().split(/\r?\n/);

        movies = rows.slice(1).map(row => {
            const values = row.split(",");

            return {
                title: values[0]?.trim() || "",
                year: values[1]?.trim() || "",
                genre: values[2]?.trim() || "",
                length: parseInt(values[3]) || 0
            };
        });

        const genres = [...new Set(
            movies
                .flatMap(movie => movie.genre.split(";"))
                .map(g => g.trim())
                .filter(Boolean)
        )].sort();

        const genreSelect = document.getElementById("genre");

        genres.forEach(genre => {
            const option = document.createElement("option");
            option.value = genre;
            option.textContent = genre;
            genreSelect.appendChild(option);
        });
    });

document.getElementById("pickMovie").addEventListener("click", () => {
    const selectedGenre = document.getElementById("genre").value;
    const minLength = parseInt(document.getElementById("length").value);

    const filtered = movies.filter(movie => {
        const genreMatch =
            !selectedGenre ||
            movie.genre.split(";").map(g => g.trim()).includes(selectedGenre);

        const lengthMatch = movie.length >= minLength;

        return genreMatch && lengthMatch;
    });

    const result = document.getElementById("result");

    if (filtered.length === 0) {
        result.textContent = "No matching movies found.";
        return;
    }

    const movie = filtered[Math.floor(Math.random() * filtered.length)];

    result.textContent = movie.year
        ? `${movie.title} (${movie.year})`
        : movie.title;
});
