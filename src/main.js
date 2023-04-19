import { createApp } from 'vue'
import App from './App.vue'
import VueApexCharts from 'vue3-apexcharts'

const app = createApp(App)
app.use(VueApexCharts)
app.mount('#app')

// Tooltips
const tooltips = document.getElementsByClassName('info-tooltip');
const activeTooltip = document.getElementsByClassName('tooltip')[0];
const tooltipsArr = Array.prototype.slice.call(tooltips);

tooltipsArr.forEach(tooltip => {
    tooltip.addEventListener("mouseover", (event) => {
        let text = tooltip.parentNode.getElementsByTagName("p")[0];
        activeTooltip.getElementsByTagName('h5')[0].innerText = text.innerText;

        activeTooltip.style.left = event.clientX - 330 + 'px';
        activeTooltip.style.top = event.clientY - 100 + 'px';
        activeTooltip.style.display = 'inline';
    });

    tooltip.addEventListener("mouseout", () => {
        activeTooltip.style.display = 'None';
    })
});
