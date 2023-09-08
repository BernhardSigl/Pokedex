function renderChart() {
    const ctx = document.getElementById('myChartId');

    const modifiedLabels = baseStatsNamesArray.map(function (name) {
        if (name === 'Special-Attack') {
            return 'S-Attack';
        } else if (name === 'Special-Defense') {
            return 'S-Defense';
        } else {
            return name;
        }
    });

    const combinedLabels = baseStatsNamesArray.map(function (name, index) {
        return name + ': ' + baseStatsValuesArray[index];
    });

    Chart.defaults.color = 'white';

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: modifiedLabels,
            datasets: [{
                data: baseStatsValuesArray,
                backgroundColor: 'white', // Setze die Balkenfarbe auf Weiß
                borderColor: 'rgba(75, 192, 192, 1)',
                barThickness: 10, // Setze die Balkendicke auf 0.5 (halbe Dicke)
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
                        font: {
                            family: 'Roboto', // Hier die gewünschte Schriftart eintragen
                            weight: '500', // Hier das Schriftgewicht einstellen (normal, bold, etc.)
                            size: '14',
                        },

                    },
                    pointLabels: {
                        font: {
                            family: 'Roboto', // Hier die gewünschte Schriftart eintragen
                            weight: '500', // Hier das Schriftgewicht einstellen (normal, bold, etc.)
                            size: '14',
                        },

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
