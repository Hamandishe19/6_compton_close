document.addEventListener("DOMContentLoaded", () => {
    const toggleButton = document.getElementById("toggleMode");
    const numericalMode = document.getElementById("numericalMode");
    const graphMode = document.getElementById("graphMode");

    let isGraphMode = false;

    toggleButton.addEventListener("click", () => {
        isGraphMode = !isGraphMode;
        if (isGraphMode) {
            numericalMode.classList.add("hidden");
            graphMode.classList.remove("hidden");
            toggleButton.textContent = "Switch to Numerical Mode";
            renderGraph();
        } else {
            numericalMode.classList.remove("hidden");
            graphMode.classList.add("hidden");
            toggleButton.textContent = "Switch to Graph Mode";
        }
    });

    // Initial fetch on page load
    fetchData();

    // Fetch every 15 seconds
    setInterval(fetchData, 15000);

    function fetchData() {
        fetch('https://api.thingspeak.com/channels/3348815/feeds.json?api_key=UAISGE3RC2SPYFXG')
            .then(response => response.json())
            .then(data => {
                const latest = data.feeds[0];
                const temperature = parseFloat(latest.field1);
                const humidity = parseFloat(latest.field2);

                document.getElementById('temperature').textContent = temperature.toFixed(1) + ' °C';
                document.getElementById('humidity').textContent = humidity.toFixed(1) + ' %';
            })
            .catch(error => {
                console.error('Error fetching ThingSpeak data:', error);
            });
    }

    function renderGraph() {
        fetch('https://api.thingspeak.com/channels/3348815/feeds.json?api_key=UAISGE3RC2SPYFXG&results=20')
            .then(response => response.json())
            .then(data => {
                const labels = [];
                const tempData = [];
                const humidityData = [];

                data.feeds.forEach(feed => {
                    labels.push(feed.created_at);
                    tempData.push(parseFloat(feed.field1));
                    humidityData.push(parseFloat(feed.field2));
                });

                const ctx = document.getElementById("dataChart").getContext("2d");
                new Chart(ctx, {
                    type: "line",
                    data: {
                        labels: labels,
                        datasets: [
                            {
                                label: "Temperature (°C)",
                                data: tempData,
                                borderColor: "#f87171",
                                fill: false,
                            },
                            {
                                label: "Humidity (%)",
                                data: humidityData,
                                borderColor: "#60a5fa",
                                fill: false,
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: { position: "top" },
                        },
                        scales: {
                            x: { title: { display: true, text: "Time" } },
                            y: { title: { display: true, text: "Values" } },
                        },
                    },
                });
            })
            .catch(error => {
                console.error('Error fetching ThingSpeak data:', error);
            });
    }
});