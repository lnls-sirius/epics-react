import { Dict, EpicsData } from "../assets/interfaces";
import Thresholds from "./threshold";
import EpicsCon from "./epics_con";

/**
 * Create a basic Epics object that updates its values in
 * fixed time intervals.
 */
class EpicsBase<T extends string|string[]> {
    public update_interval: number;
    public thresholds: Thresholds;
    public pv_name: T;
    public last_update: Date;

    constructor(pvname: T){
        this.update_interval = 300;
        this.set_pvname(pvname);
        this.thresholds = new Thresholds();
        this.last_update = new Date(0);
    }

    initialize(pv_name: T, threshold: undefined|Dict<number>, update_interval: undefined|number): void {
        this.set_pvname(pv_name);

        if(threshold !== undefined) {
            this.thresholds.set_thresholds(threshold);
        }
        if(update_interval !=undefined){
            this._set_update_interval(update_interval);
        }
    }

    start_timer(fun: ()=>void): NodeJS.Timer {
        return setInterval(
            fun, this.update_interval);
    }

    stop_timer(timer: NodeJS.Timer): void {
        clearInterval(timer);
    }

    reset_last_update(): void {
        this.last_update = new Date(0);
    }

    update_last_update(update_date: Date|null): void {
        if(update_date)
            this.last_update = update_date;
    }

    get_pv_data<M>(): Dict<EpicsData<M>> {
        let pvData: Dict<EpicsData<M>> = EpicsCon.get_pv_data();
        return pvData;
    }

    get_threshold(value: number): string {
        return this.thresholds.get_biggest_threshold(value);
    }

    set_pvname(pvname: T): void {
        if(this._equal_check(pvname)){
            if(this.pv_name)
                this._unsubscribe2epics_con();
            this.pv_name = pvname;
            this._subscribe2epics_con();
        }
    }

    destroy(): void {
        this._unsubscribe2epics_con();
    }

    _equal_check(pvname: T): boolean {
        return JSON.stringify(this.pv_name) != JSON.stringify(pvname);
    }

    _set_update_interval(milliseconds: number): void {
        this.update_interval = milliseconds;
    }

    _subscribe2epics_con(){
        EpicsCon.add_new_pv<T>(this.pv_name);
    }

    _unsubscribe2epics_con(){
        EpicsCon.remove_pv<T>(this.pv_name);
    }
}

export default EpicsBase;
