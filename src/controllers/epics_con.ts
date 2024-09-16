import Epics from "../access_data/Epics";
import { Dict, EpicsData } from "../assets/interfaces";

/**
 * Create an static Epics connection that allows
 * widget to subscribe or unsubscribe to the monitoring.
 */
class EpicsCon {
    private static epics: Epics = new Epics([]);
    private static pv_name: string[] = [];

    static convert2list<T extends string|string[]>(new_pv: T): string[]{
        if(Array.isArray(new_pv)){
            return new_pv;
        }
        return [new_pv];
    }

    /**
     * Returns a list with the PVs that are not already subscribed.
     */
    static new_pvs_list(pv_list: string[]): string[]{
        let pvs2add: string[] = [];
        pv_list.map((pvname: string) => {
            if(!(this.pv_name.includes(pvname))){
                pvs2add.push(pvname);
            }
        })
        return pvs2add;
    }

    /**
     * Create a new connection using the Epics Object.
     */
    static create_epics(){
        this.epics.disconnect();
        return new Epics(this.pv_name);
    }

    /**
     * Subscribe new list of PVs.
     */
    static add_new_pv<T extends string|string[]>(new_pv: T){
        let list2add: string[] = [];
        let new_pv_list: string[] = this.convert2list<T>(new_pv);
        list2add = this.new_pvs_list(new_pv_list);
        this.pv_name = this.pv_name.concat(list2add);
        this.epics = this.create_epics();
    }

    /**
     * Unsubscribe new list of PVs.
     */
    static remove_pv<T extends string|string[]>(rem_pv: T){
        let pv_list: string[] = this.pv_name;
        const rem_pv_list: string[] = this.convert2list<T>(rem_pv);
        rem_pv_list.map((pvname: string) => {
            if(pvname in this.pv_name){
                delete pv_list[pvname];
            }
        })
        this.pv_name = pv_list;
    }

    /**
     * Get a list of the current values of all subscribed PVs.
     */
    static get_pv_data<M>(): Dict<EpicsData<M>> {
        let pvData: Dict<EpicsData<M>> = this.epics.pvData;
        return pvData;
    }
}

export default EpicsCon;
