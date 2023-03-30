import Epics from "../data-access/EPICS/Epics";
import { Dict, EpicsData } from "../assets/interfaces";

class Thresholds {
    private thr_dict: Dict<number>;
    private thr_arr: [string, number][];

    constructor(){
        this.thr_dict = {};
        this.thr_arr = [];
    }

    set_thresholds(threshold: Dict<number>): void {
        this.thr_dict = threshold;
        this.thr_arr = this.sort_dict(this.thr_dict);
    }

    dict2array(dictionary: Dict<number>): [string, number][] {
        return Object.entries(dictionary).map(([key, value]: [string, number])=>{
            return [key, value];
        });
    }

    sort_dict(dictionary: Dict<number>): [string, number][] {
        let thr_arr: [string, number][] = this.dict2array(dictionary);
        thr_arr.sort(function(first, second){
            return second[1] - first[1];
        });
        return thr_arr;
    }

    get_final_state(value: number, threshold: [string, number][]): string {
        for(let a = 0; a < threshold.length; a++) {
            if(value >= threshold[a][1]){
                return threshold[a][0];
            }
        }
        return 'normal';
    }

    get_biggest_threshold(value: number): string {
        let final_state: string = 'normal';
        if( this.thr_dict !== undefined ){
            final_state = this.get_final_state(value, this.thr_arr);
        }
        return final_state
    }
}

// Should accept 1 or + PVs with 1 or + values
class EpicsBase<T> {
    private update_interval: number;
    private epics: Epics;
    private timer: null | NodeJS.Timer;
    private pv_name: T;
    private thresholds: Thresholds;

    constructor(pvname: T){
        this.update_interval = 100;
        this.pv_name = pvname;
        this.epics = this.create_epics();
        this.timer = null;
        this.thresholds = new Thresholds();
    }

    initialize(pv_name: T, threshold: undefined|Dict<number>, update_interval: undefined|number): void {
        this.set_pvname(pv_name);
        this.create_epics();

        if(threshold !== undefined) {
            this.set_thresholds(threshold);
        }
        if(update_interval !=undefined){
            this.set_update_interval(update_interval);
        }
    }

    start_timer(fun: ()=>void): void {
        this.timer = setInterval(
            fun, this.update_interval);
    }

    get_pv_data<M>(): Dict<EpicsData<M>> {
        let pvData: Dict<EpicsData<M>> = this.epics.pvData;
        return pvData;
    }

    get_threshold(value: number): string {
        return this.thresholds.get_biggest_threshold(value);
    }

    set_pvname(pvname: T): void {
        this.pv_name = pvname;
    }

    set_update_interval(milliseconds: number): void {
        this.update_interval = milliseconds;
    }

    set_thresholds(thresholds: Dict<number>): void {
        this.thresholds.set_thresholds(thresholds);
    }

    create_epics(): Epics {
        if(Array.isArray(this.pv_name)){
            return new Epics(this.pv_name);
        }
        return new Epics([this.pv_name]);
    }

    destroy(): void {
        if(this.timer!=null){
            clearInterval(this.timer);
            this.epics.disconnect();
        }
    }
}

export default EpicsBase;
