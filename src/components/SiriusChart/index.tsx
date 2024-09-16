import React, { Component, createRef } from "react";
import Chart  from 'chart.js/auto';
import EpicsBase from "../../controllers/epics_base";
import { default_colors } from "../../assets/themes";
import { Dict, ChartPv, RefChart, EpicsData } from "../../assets/interfaces";
import { chartOptions } from "./options";
import * as S from './styled';

/**
 * Default Chart component for monitoring a list of PVs from the EPICS control system.
*/
class SiriusChart extends Component<ChartPv>{
  private chartRef: RefChart;
  private color_list: Dict<string>;
  private epics: EpicsBase<string[]>;
  private labelList: (string|string[])[];
  private threshold_lines: any[];
  public chart: null|Chart;

  constructor(props: ChartPv){
    super(props);
    this.updateChart = this.updateChart.bind(this);

    this.chartRef = createRef();
    this.color_list = this.initialize_bar_style(props.color);
    this.epics = this.initialize_epics_base(props);
    this.labelList = this.initialize_label_list(props.label);
    this.threshold_lines = [];
    this.chart = null;
  }

  /**
   * Create a new Chart when the component is mounted.
   */
  componentDidMount(): void {
    if(this.chartRef.current != null){
      this.chart = this.createChart(
        this.chartRef.current);
      this.updateChart();
    }else{
      console.log("Error!")
    }
  }

  /**
   * Save PV name with update
   */
  componentDidUpdate(): void {
    const { pv_name, label } = this.props;
    this.epics.set_pvname(pv_name);
    this.labelList = this.initialize_label_list(label);
    if(this.chartRef.current != null){
      this.chart?.destroy();
      this.chart = this.createChart(
        this.chartRef.current);
      this.updateChart();
    }
  }

  componentWillUnmount(): void {
    this.epics.destroy();
  }

  initialize_epics_base(props: ChartPv): EpicsBase<string[]> {
    const { pv_name, threshold, update_interval } = props;

    this.epics = new EpicsBase(pv_name);
    this.epics.initialize(pv_name, threshold, update_interval);
    this.epics.start_timer(this.updateChart);

    return this.epics;
  }

  initialize_bar_style(color: Dict<string>|undefined): Dict<string> {
    if(color !== undefined) {
      color = this.handle_default_color(color);
      return color;
    }
    return default_colors.chart;
  }

  initialize_label_list(labels: (string|string[])[]|undefined): (string|string[])[] {
    const { pv_name } = this.props;
    let labelList: (string|string[])[] = [];
    pv_name.map((pv_name: string, idx_data: number)=>{
      let label: string|string[] = pv_name;
      if(labels!==undefined){
        if(labels[idx_data]!==undefined){
          label = labels[idx_data];
        }
      }
      labelList[idx_data] = label;
    })
    return labelList
  }

  handle_default_color(color: Dict<string>): Dict<string> {
    if(!('nc' in color)){
      color["nc"] = default_colors.chart["nc"];
    }
    if(!('normal' in color)){
      color["normal"] = default_colors.chart["normal"];
    }
    return color;
  }

  capitalize(str: string): string {
    return str[0].toUpperCase()+str.slice(1)
  }

  /**
   * Create threshold lines and save them.
   */
  create_threshold_line(datasetList: any[]): any[] {
    const { threshold } = this.props;
    const line_all_element: boolean = this.threshold_lines.length != this.labelList.length;
    let dataset_threshold: any[] = this.threshold_lines;
    if(threshold && line_all_element){
      Object.entries(threshold).map(([label, value]: [string, number]) => {
        const color: string = this.color_list[label];
        if(datasetList[0].data.length > 0){
          const datasetTemp: any = {
            data: (datasetList[0].data.map(()=>{return value})),
            type: 'line',
            yAxisID: 'y',
            label: this.capitalize(label),
            borderColor: color,
            fillColor: color,
            strokeColor: color
          }
          dataset_threshold.push(datasetTemp);
        }
      })
    }
    return dataset_threshold;
  }

  /**
   * Add threshold lines to the chart.
   */
  add_thresholds(datasetList: any[]): any[] {
    this.threshold_lines.map((axis_data: any) => {
      datasetList.push(axis_data);
    });
    return datasetList;
  }

  /**
   * Set new datasets and labels to the EPICS Chart.=
   */
  updateDataset(newData: any[], labels: (string|string[])[]): void {
    if(this.chart){
      this.chart.data.labels = labels;
      this.chart.data.datasets = newData;
      this.chart.update();
    }
  }

  /**
   * Update the EPICS chart with more recent data received from the PVs.
   */
  async updateChart(): Promise<void> {
    if(this.chart != null){
      const datasetList: any[] = await this.buildChart();
      let dataset: any[] = datasetList;
      this.threshold_lines = this.create_threshold_line(dataset);
      dataset = this.add_thresholds(dataset);
      this.updateDataset(dataset, this.labelList);
    }
  }

  /**
   * Build a dataset with the data read from EPICS.
   */
  async buildChart(): Promise<any[]> {
    const { pv_name, modifyValue } = this.props;
    let datasetList: number[] = [];
    let colorList: string[] = [];
    const pvData: any = this.epics.get_pv_data();
    pv_name.map(async (pvname: string, idx_data: number)=>{
      const pvInfo: EpicsData<string> = pvData[pvname];
      if(typeof(pvInfo.value) == "number"){
        datasetList[idx_data] = pvInfo.value;
        if(modifyValue != undefined){
          datasetList[idx_data] = modifyValue(
            pvInfo.value, pvname);
        }
      }else{
        datasetList[idx_data] = 0;
      }
      const threshold_type = this.epics.get_threshold(datasetList[idx_data]);
      colorList[idx_data] = this.color_list[threshold_type];
    })
    let dataset: any[] = [{
      data: datasetList,
      backgroundColor: colorList,
      borderColor: colorList
    }]
    return dataset;
  }

  /**
   * Create a and configure the chart.
   */
  createChart(reference: HTMLCanvasElement): Chart {
    const { pv_name, modifyOptions, color_label } = this.props;

    const subLabel = {
      id: "subLabels",
      afterDatasetDraw(chart){
        const {ctx, chartArea: {left, bottom, width}} = chart;
        if(color_label){
          const size: number = color_label.length;
          ctx.save();
          color_label.map((color: string, idx: number) =>{
            const x: number = (width/(size*2))*(idx*2)+left;
            ctx.fillStyle = color;
            ctx.fillRect(x, bottom+3, width/size, 27);
          })
        }
      }
    }

    let options:any = chartOptions;
    if(color_label){
      options.scales.x.ticks.padding = 25;
    }

    const config: any = {
      type: "bar",
      options: chartOptions,
      plugins: [subLabel]
    }

    if(modifyOptions != undefined){
      config.options = modifyOptions(
        config.options, pv_name);
    }

    return new Chart(
      reference,
      config
    );
  }

  render(): React.ReactNode {
    return (
      <S.ChartWrapper>
        <S.Chart
          data-testid="sirius-chart"
          id="canva"
          ref={this.chartRef}/>
      </S.ChartWrapper>
    )
  }
}

export default SiriusChart;
