import { Dict } from "../assets/interfaces";

/**
 * Class that return the state of the PV based on
 * its value and the thresholds established.
 */
class Thresholds {
    private thr_dict: Dict<number>;
    private thr_arr: [string, number][];

    constructor(){
        this.thr_dict = {};
        this.thr_arr = [];
    }

    dict2array(dictionary: Dict<number>): [string, number][] {
        return Object.entries(dictionary).map(([key, value]: [string, number])=>{
            return [key, value];
        });
    }

    /**
     * Sort threshold dictionary in crescent order
     */
    sort_dict(): [string, number][] {
        let thr_arr: [string, number][] = this.dict2array(this.thr_dict);
        thr_arr.sort(function(first, second){
            return second[1] - first[1];
        });
        return thr_arr;
    }

    set_thresholds(threshold: Dict<number>): void {
        this.thr_dict = threshold;
        this.thr_arr = this.sort_dict();
    }

    /**
     * Get threshold state.
     */
    get_biggest_threshold(value: number): string {
        if( this.thr_dict !== undefined ){
            for(let a = 0; a < this.thr_arr.length; a++) {
                if(value >= this.thr_arr[a][1]){
                    return this.thr_arr[a][0];
                }
            }
        }
        return 'normal';
    }
}

export default Thresholds;
