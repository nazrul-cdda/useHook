
async function getTodos() {
    try {
        const res = await fetch("https://jsonplaceholder.typicode.com/todos");
        const data = await res.json();
        console.log("Todos:", data);

        return data;
    } catch (err) {
        console.error("Failed to fetch todos:", err.message);
        return [];
    }
}
getTodos();
