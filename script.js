let countryURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
let educationURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";

let countryData;
let educationData;

let canvas = d3.select("#canvas");
let tooltip = d3.select('#tooltip')

let drawMap = () => {
    canvas.selectAll('path')
        .data(countryData)
        .enter()
        .append('path')
        .attr('d', d3.geoPath())
        .attr('class', 'county')
        .attr('fill', (countyDataItem) => {
            let id = countyDataItem['id'];
            let county = educationData.find((item) => {
                return item['fips'] === id;
            });
            let percentage = county['bachelorsOrHigher'];
            if (percentage <= 15) {
                return '#3a5a40';
            } else if (percentage <= 30) {
                return '#588157';
            } else if (percentage <= 45) {
                return '#a3b18a';
            } else {
                return '#dad7cd';
            }
        })

        .attr ('data-fips', (countyDataItem) => {
            return countyDataItem ['id']
        })

        .attr ('data-education', (countyDataItem) => {
            let id = countyDataItem ['id']
            let county =educationData.find ((item) => {
                return item ['fips'] === id
            })
            let percentage = county['bachelorsOrHigher']
            return percentage
        })

        .on('mouseover', (countyDataItem) => {
            tooltip.transition()
                    .style('visibility', 'visible')

                    let id = countyDataItem ['id']
                    let county = educationData.find ((item) => {
                        return item ['fips'] === id
                    })

                    tooltip.text (county ['fips'] + ' - ' + county ['area_name'] + ',' + county['state'] + ' : ' + county ['bachelorsOrHigher'] + '%')

                    tooltip.attr('data-education', county['bachelorsOrHigher'])
        })

        .on ('mouseout', (countyDataItem) => {
            tooltip.transition()
                    .style ('visibility', 'hidden')
        })


};

d3.json(countryURL).then((data, error) => {
    if (error) {
        console.log(error);
    } else {
        countryData = data;
        countryData = topojson.feature(data, data.objects.counties).features;
        console.log(countryData);

        d3.json(educationURL).then((data, error) => {
            if (error) {
                console.log(error);
            } else {
                educationData = data;
                console.log(educationData);
                drawMap();
            }
        });
    }
});
