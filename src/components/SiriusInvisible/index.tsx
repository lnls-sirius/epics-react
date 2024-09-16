import React, { useEffect } from "react";
import EpicsBase from "../../controllers/epics_base";
import { PvInterface, EpicsData, Dict } from "../../assets/interfaces";

/**
 * Default invisble component for monitoring a list of PVs from the EPICS control system.
 */
const SiriusInvisible: React.FC<PvInterface<string[]>> = (props) => {
  const epics: EpicsBase<string[]> = new EpicsBase<string[]>(props.pv_name);

  useEffect(() => {
    const timerId = initialize_epics_base();
    return () => {
      epics.stop_timer(timerId);
    }
  }, [props]);

  useEffect(() => () => {
    epics.destroy();
  }, []);

  const initialize_epics_base = (): NodeJS.Timer => {
    const { pv_name, threshold, update_interval } = props;
    epics.initialize(pv_name, threshold, update_interval);
    const timerId = epics.start_timer(updateLabel);
    return timerId;
  }

  /**
   * Update values with measured EPICS value
   */
  const updateLabel = (): void => {
    const { pv_name, modifyValue } = props;
    const pvData: Dict<EpicsData<string>> = epics.get_pv_data();
    pv_name.map((pvname: string) => {
      const pvInfo: EpicsData<string> = pvData[pvname];
      if(pvInfo == undefined || modifyValue==undefined)
        return;
      if(!pvInfo.value)
        return;
      modifyValue<EpicsData<string>>(
        pvInfo, pvname);
    })
  }

  return <div data-testid="sirius-invisible"/>;
}

export default SiriusInvisible;
