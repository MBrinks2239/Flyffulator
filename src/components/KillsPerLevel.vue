<template>
  <div class="extensivechart">
      <p id="info">How many kills it would take to gain one level at each of these monsters at your current level.</p>
      <img class="info-tooltip" src='../assets/images/Icons/info.png'>

      <apexchart
      height="230"
      width="331"
      type="area"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>

<script>
export default {
  name: 'KillsPerLevel',
  watch: {
    '$root.monsters'() {
      this.update()
    },
    '$root.darkMode'() {
      this.updateTheme()
    }
  },
  created() { this.update() },
  methods: {
    updateTheme() {
      let opts = {... this.chartOptions}
      opts.title.style.color = this.$root.hcolor
      this.chartOptions = opts
    },
    update() {
      this.monsters = this.$root.monsters
      this.character = this.$root.character.ref
      let killreq = []
      let names = []

      this.monsters.forEach(monster => {
        if (monster.experience > 0) {
          const expReward = this.$root.getExpReward(monster, this.character.level)
          if (expReward > 0) {
            killreq = [...killreq, parseFloat(100 / expReward).toFixed(2)]
            names = [...names, 'Level ' + monster.level + ': ' + monster.name.en]
          }
        }
      })

      // Average kill per level for each monster
      const killsum = killreq.reduce((a, b) => parseFloat(a) + parseFloat(b), 0)
      const killavg = (killsum / killreq.length).toFixed(0) || 0

      this.series[0].data = killreq

      let opts = {... this.chartOptions}
      opts.xaxis.categories = names
      opts.annotations.yaxis[0].y = killavg
      opts.annotations.yaxis[0].label.text = 'Average: ' + killavg
      this.chartOptions = opts
    }
  },
  data() {
    return {
      monsters: this.$root.monsters,
      character: this.$root.character.ref,
      chartOptions: {
        chart: {
          animations: {
            enabled: false
          },
          toolbar: {
            show: false
          },
          zoom: {
            enabled: false
          },
          dropShadow: {
            enabled: true,
            top: 10,
            left: 0,
            blur: 5,
            color: '#1F2342',
            opacity: 0.25
          },
        },
        stroke: {
          show: true,
          width: 3,
          curve: 'smooth',
        },
        annotations: {
          yaxis: [{
            y: 30,
            strokeDashArray: 3,
            label: {
                text: 'Average'
            }
          }]
        },
        plotOptions: {
          radar: {
            size: 115,
            polygons: {
              strokeColors: '#7279AA',
              strokeWidth: 0.5,
              connectorColors: '#7279AA'
            }
          }
        },
        markers: {
          colors: '#008ffb'
        },
        title: {
          text: "Kills/level",
          align: 'left',
          margin: 10,
          offsetX: 30,
          offsetY: 60,
          floating: false,
          style: {
            fontSize:  '21px',
            fontWeight:  '500',
            fontFamily:  "Roboto",
            color:  this.$root.hcolor
          }
        },
        tooltip: {
          followCursor: true
        },
        fill: {
          opacity: 0.85,
          type: ['gradient'],
          gradient: {
              shade: 'dark',
              type: "vertical",
              shadeIntensity: 0.5,
              opacityFrom: 1,
              opacityTo: 0,
              stops: [0, 90, 100]
          }
        },
        grid: {
          show: false
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          type: 'categories',
          labels: {
            show: false
          },
          axisTicks: {
            show: false
          },
          axisBorder: {
            show: false
          },
          categories: ["70", "80", "90", "100", "110", "120"]
        },
        yaxis: {
          labels: {
            show: false,
          }
        },
      },
      series: [
        {
          name: "Kills Required",
          data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
        },
      ],
    }
  }
}
</script>

<style scoped lang='scss'>
.vue-apexcharts {
  margin-left: -21px;
  margin-top: -45px;
}
</style>
