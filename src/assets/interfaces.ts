interface Dict<T> {
    [key: string]: T
}

interface PvTooltipInterface{
    text: string,
    children: React.ReactNode
}

interface PvListInterface {
    pv_list: Array<string>
}

interface BarChartParameters{
    color: Dict<string>
    label: (string|string[])[],
    thresholdLines: any[]
}

interface ChartPv
    extends PvInterface<string[]> {
        color?: Dict<string>,
        label?: (string|string[])[],
        color_label?: string[],
        modifyOptions?: (
            options: any, pv_name: string[]) => any
}

interface PvInterface<T>{
    pv_name: T,
    egu?: string,
    update_interval?: number,
    threshold?: Dict<number>,
    modifyValue?: <M>(value: M, pvname: string) => M;
}

interface EpicsData<T> {
    date: null|Date,
    value: null|T,
    datatype: null|string,
    count: null|number
}

interface LabelPv
    extends PvInterface<string> {
        precision?: number
}

interface LedStatus<T> {
    shape: string,
    color?: T
}

interface LedPv
    extends PvInterface<string>,
    LedStatus<Dict<string>>{
        disc_time?: number
}

export type {
    PvListInterface,
    ChartPv,
    BarChartParameters,
    PvInterface,
    EpicsData,
    PvTooltipInterface,
    LabelPv,
    LedStatus,
    LedPv,
    Dict
}
