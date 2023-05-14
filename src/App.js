import React, { useState } from 'react';
import Papa from 'papaparse';
import { Chart } from 'chart.js';

function App() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const response = await fetch('https://www.terriblytinytales.com/test.txt');
    const text = await response.text();
    const wordsMap = new Map();
    const regex = /\b\w+\b/g;
    let match;
    while ((match = regex.exec(text))) {
      const word = match[0].toLowerCase();
      wordsMap.set(word, (wordsMap.get(word) || 0) + 1);
    }
    const sortedWords = [...wordsMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20);
    setWords(sortedWords);
    setLoading(false);
    plotHistogram(sortedWords);
  };

  const plotHistogram = (data) => {
    const labels = data.map(([word, count]) => word);
    const counts = data.map(([word, count]) => count);
    const ctx = document.getElementById('histogram').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Word Frequency',
          data: counts,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  };

  const handleExport = () => {
    const csv = Papa.unparse(words);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'histogram.csv';
    link.click();
  };

  return (
    <div>
      <button onClick={handleSubmit} disabled={loading}>Submit</button>
      {words.length > 0 && (
        <div>
          <canvas id="histogram" width="400" height="400"></canvas>
          <button onClick={handleExport}>Export</button>
        </div>
      )}
    </div>
  );
}

export default App;