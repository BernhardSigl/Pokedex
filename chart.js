function renderChart() {
    const ctx = document.getElementById('myChartId');

    const combinedLabels = baseStatsNamesArray.map(function (name, index) {
        return name + ': ' + baseStatsValuesArray[index];
    });

    Chart.defaults.color = 'white';

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: combinedLabels,
            datasets: [{
                data: baseStatsValuesArray,
                backgroundColor: 'white', // Setze die Balkenfarbe auf Weiß
                borderColor: 'rgba(75, 192, 192, 1)',
                barThickness: 15, // Setze die Balkendicke auf 0.5 (halbe Dicke)
            }]
        },
        options: {
            indexAxis: 'y',
            scales: {
                x: {
                    display: false,
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        display: false,
                    },
                    ticks: {
                        display: true,
                        fontSize: 10,
                    },
                    pointLabels: {
                        font: {
                            family: 'Roboto',
                            weight: 'medium',
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            },
        }
    });
}
