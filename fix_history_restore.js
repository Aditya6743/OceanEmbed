const fs = require('fs');
let file = 'frontend/src/pages/Explore.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = `    return (
    ) => {
      steps.forEach(clearTimeout);
      clearTimeout(predictionTimeout);
    };
  }, [isLoading, selectedLocation, setPrediction, setError, selectedDate]);`;

const newStr = `    return () => {
      steps.forEach(clearTimeout);
      clearTimeout(predictionTimeout);
    };
  }, [isLoading, selectedLocation, setPrediction, setError, selectedDate]);

  // Restore history data if returning to the page with an existing prediction
  React.useEffect(() => {
    if (!isLoading && prediction && selectedLocation && historyData.length === 0) {
      generateAccurateHistory(selectedLocation.latitude, selectedLocation.longitude, selectedDate)
        .then(history => setHistoryData(history))
        .catch(() => console.warn("Failed to fetch history"));
    }
  }, [isLoading, prediction, selectedLocation, historyData.length, selectedDate]);`;

content = content.replace(targetStr, newStr);
fs.writeFileSync(file, content);
console.log('Added history data restoration logic!');
