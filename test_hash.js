const mldOptions = [75, 100, 125, 150, 175, 200];
const counts = {75:0, 100:0, 125:0, 150:0, 175:0, 200:0};
for(let lat=5; lat<=25; lat++) {
    for(let lon=65; lon<=95; lon++) {
        const chunkHash = Math.abs(Math.sin(lat * 13.37 + lon * 73.19)) * 10000;
        const mld = mldOptions[Math.floor(chunkHash) % 6];
        counts[mld]++;
    }
}
console.log(counts);
