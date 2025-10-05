// t04-5-bars.js
const createBarChart = (data) => {
    // choose a narrow width for scaling
    const viewW = 500; // narrow on purpose (forces x scaling)
    const viewH = Math.max(220, data.length * 28); // tall logical space for many bars
    // Physical display size (what you see on the page)
    const displayW = 640; // try 480–800 as you prefer
    const displayH = Math.min(480, data.length * 24 + 40); // try 360–500
    const svg = d3.select(".responsive-svg-container")
        .append("svg")
            .attr("viewBox", `0 0 ${viewW} ${viewH}`) // logical coords
            .attr("width", displayW) // actual rendered size
            .attr("height", displayH) // actual rendered size
            .style("border", "1px solid black"); 
    // x: numeric (e.g., count)
    const xMax = d3.max(data, d => d.count); // adjust 'count' if your column name differs
    const xScale = d3.scaleLinear()
        .domain([0, xMax]) // data space
        .range([0, viewW]); // pixels across the logical width
    // Y scale (categorical) — change 'brand' if your category column differs
    const yScale = d3.scaleBand()
        .domain(data.map(d => d.brand))
        .range([0, viewH])
        .paddingInner(0.2)
        .paddingOuter(0.1);
    // OLD rectangle-only drawing block from T04-6 (COMMENTED OUT for T04-7). //
    // Bars
    /* svg.selectAll("rect")
        .data(data)
        .join("rect")
            .attr("class", d => `bar bar-${d.count}`)
            .attr("x", 0)
            .attr("y", d => yScale(d.brand))
            .attr("width", d => xScale(d.count))
            .attr("height", yScale.bandwidth())
            .attr("fill", "steelblue"); */
    
    // --- NEW in T04-7: group per row (bar + labels move together) ---
    // Using x = 100 so labels align at 100 and bars start there too.
    const labelX = 100;
    const barAndLabel = svg
        .selectAll("g")
        .data(data)
        .join("g")
        .attr("transform", d => `translate(0, ${yScale(d.brand)})`);
    // --- Bar rectangle inside the group ---
    // y is 0 because the group sets vertical position via transform.
    barAndLabel
        .append("rect")
            .attr("x", labelX) // bar starts at x = 100
            .attr("y", 0)
            .attr("width", d => xScale(d.count)) // scaled width fits the viewBox
            .attr("height", yScale.bandwidth()) // bar thickness from band scale
            .attr("fill", "steelblue");
    // --- Category text (left of bar, right-aligned at x=100) ---
    barAndLabel
        .append("text")
            .text(d => d.brand) // change if your category column differs
            .attr("x", labelX)
            .attr("y", 15) // adjust to center in the band
            .attr("text-anchor", "end") // right-align so text ends at x=100
            .style("font-family", "sans-serif")
            .style("font-size", "13px");
    // --- Value text (at the end of each bar) ---
    barAndLabel
        .append("text")
            .text(d => d.count) // numeric label
            .attr("x", d => 100 + xScale(d.count) + 4) // just past bar end
            .attr("y", 12) // adjust as needed
            .style("font-family", "sans-serif")
            .style("font-size", "13px");
};