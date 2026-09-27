const fs = require('fs');
let file = 'frontend/src/pages/Solutions.tsx';
let content = fs.readFileSync(file, 'utf8');

// Fix setState in effect 1
const oldEffect1 = `  // Trigger cinematic loading when date changes
  useEffect(() => {
    if (activeTab === 'iot') return;
    setIsSectionLoading(true);
    const timer = setTimeout(() => setIsSectionLoading(false), 400);
    return () => clearTimeout(timer);
  }, [selectedDate]);`;

const newEffect1 = `  // Trigger cinematic loading when date changes
  useEffect(() => {
    if (activeTab === 'iot') return;
    setIsSectionLoading(true);
    const timer = setTimeout(() => setIsSectionLoading(false), 400);
    return () => clearTimeout(timer);
  }, [selectedDate, activeTab]);`;

content = content.replace(oldEffect1, newEffect1);

// Fix effect 2
const oldEffect2 = `  useEffect(() => {
    if (selectedDate === '2026-06-01') {
      setSelectedDate(todayStr);
    }
  }, []);`;

const newEffect2 = `  useEffect(() => {
    if (selectedDate === '2026-06-01') {
      setSelectedDate(todayStr);
    }
  }, [selectedDate, setSelectedDate, todayStr]);`;

content = content.replace(oldEffect2, newEffect2);

fs.writeFileSync(file, content);
console.log('Fixed linting dependencies');
